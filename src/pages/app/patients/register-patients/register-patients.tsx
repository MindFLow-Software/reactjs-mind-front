"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, isValid, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2, CalendarIcon, Venus, Mars, Users, ShieldCheck, Contact } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { IMaskMixin } from "react-imask"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { registerPatients } from "@/api/create-patients"
import { uploadAttachment } from "@/api/attachments"
import { cn } from "@/lib/utils"
import { UploadZone } from "./upload-zone"
import { PatientAvatarUpload } from "./patient-avatar-upload"

const registerPatientSchema = z.object({
    firstName: z.string().min(1, "Obrigatório"),
    lastName: z.string().min(1, "Obrigatório"),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.date()
        .nullable()
        .optional()
        .refine((date) => !date || date <= new Date(), {
            message: "Data de nascimento inválida",
        }),
    cpf: z.string().optional(),
    gender: z.enum(["FEMININE", "MASCULINE", "OTHER"]),
})

type RegisterPatientData = z.infer<typeof registerPatientSchema>

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
    <Input ref={inputRef} {...props} />
))

export function RegisterPatients({ onSuccess }: { onSuccess?: () => void }) {
    const queryClient = useQueryClient()
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [calendarOpen, setCalendarOpen] = useState(false)

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<RegisterPatientData>({
        resolver: zodResolver(registerPatientSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            cpf: "",
            gender: "FEMININE",
            dateOfBirth: null,
        }
    })

    const { mutateAsync: registerPatientFn, isPending } = useMutation({
        mutationFn: registerPatients,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unseen-popups'] })
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            queryClient.invalidateQueries({ queryKey: ["metrics"] })
            toast.success("Paciente cadastrado com sucesso!")
            onSuccess?.()
        },
        onError: (err) => {
            let errorMessage = "Erro ao cadastrar paciente."
            if (err instanceof AxiosError && err.response) {
                errorMessage = err.response.data?.message || "Erro na comunicação com o servidor."
            }
            toast.error(errorMessage)
        }
    })

    async function onSubmit(data: RegisterPatientData) {
        try {
            setIsUploading(true)

            let profileImageUrl = undefined
            if (avatarFile) {
                const response = await uploadAttachment(avatarFile)
                profileImageUrl = response.url
            }

            let attachmentIds: string[] = []
            if (selectedFiles.length > 0) {
                attachmentIds = await Promise.all(
                    selectedFiles.map(async (file) => {
                        const response = await uploadAttachment(file)
                        return response.attachmentId
                    })
                )
            }

            await registerPatientFn({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber || undefined,
                dateOfBirth: data.dateOfBirth || undefined,
                cpf: data.cpf || undefined,
                gender: data.gender as any,
                role: "PATIENT" as any,
                isActive: true,
                expertise: "OTHER" as any,
                profileImageUrl,
                attachmentIds,
            })

            reset()
            setAvatarFile(null)
            setSelectedFiles([])
        } catch (error) {
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold tracking-tight">Novo Prontuário</DialogTitle>
                <DialogDescription>
                    Crie um novo prontuário para iniciar o acompanhamento do paciente.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
                <section aria-label="Foto de perfil">
                    <PatientAvatarUpload onFileSelect={setAvatarFile} />
                </section>

                <fieldset className="space-y-4">
                    <legend className="text-sm font-semibold text-foreground flex items-center gap-2 px-1 mb-4">
                        <Contact className="size-4 text-blue-500" />
                        Dados Pessoais
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                            <Input
                                {...register("firstName")}
                                placeholder="Ex: Ana"
                                className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                            <Input
                                {...register("lastName")}
                                placeholder="Ex: Silva"
                                className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="space-y-4 opacity-90 hover:opacity-100 transition-opacity">
                    <legend className="text-sm font-semibold text-foreground flex items-center gap-2 pt-2 border-t w-full px-1 mb-4">
                        <ShieldCheck className="size-4 text-blue-500" />
                        Informações Complementares (Opcional)
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>CPF</Label>
                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field: { ref, ...f } }) => (
                                    <MaskedInput
                                        {...f}
                                        inputRef={ref}
                                        mask="000.000.000-00"
                                        placeholder="000.000.000-00"
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Celular / WhatsApp</Label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field: { ref, ...f } }) => (
                                    <MaskedInput
                                        {...f}
                                        inputRef={ref}
                                        mask="(00) 00000-0000"
                                        placeholder="(00) 00000-0000"
                                    />
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento</Label>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }) => {
                                    const [inputValue, setInputValue] = useState(
                                        field.value ? format(field.value, "dd/MM/yyyy") : ""
                                    )

                                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                        let val = e.target.value.replace(/\D/g, "")
                                        if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2)
                                        if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 10)
                                        setInputValue(val)

                                        if (val.length === 10) {
                                            const parsedDate = parse(val, "dd/MM/yyyy", new Date())
                                            if (isValid(parsedDate)) {
                                                field.onChange(parsedDate)
                                            } else {
                                                field.onChange(null)
                                            }
                                        } else if (val.length === 0) {
                                            field.onChange(null)
                                        }
                                    }

                                    return (
                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                            <div className="relative w-full">
                                                <Input
                                                    placeholder="DD/MM/AAAA"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                    maxLength={10}
                                                    className={cn("pr-10", errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500")}
                                                />
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer text-muted-foreground"
                                                    >
                                                        <CalendarIcon className="size-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                            </div>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="center" sideOffset={8}>
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    captionLayout="dropdown"
                                                    fromYear={1900}
                                                    toYear={new Date().getFullYear()}
                                                    disabled={(date) => date > new Date()}
                                                    onSelect={(date) => {
                                                        field.onChange(date)
                                                        if (date) setInputValue(format(date, "dd/MM/yyyy"))
                                                        setCalendarOpen(false)
                                                    }}
                                                    locale={ptBR}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    )
                                }}
                            />
                            {errors.dateOfBirth && (
                                <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                                    {errors.dateOfBirth.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Gênero</Label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="FEMININE" className="cursor-pointer">
                                                <div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-500" /> Feminino</div>
                                            </SelectItem>
                                            <SelectItem value="MASCULINE" className="cursor-pointer">
                                                <div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-500" /> Masculino</div>
                                            </SelectItem>
                                            <SelectItem value="OTHER" className="cursor-pointer">
                                                <div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-500" /> Outro</div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </fieldset>

                <section aria-label="Anexos e documentos">
                    <UploadZone selectedFiles={selectedFiles} onFilesChange={setSelectedFiles} />
                </section>

                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={isPending || isUploading}
                        className="gap-2 w-full lg:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                        {(isPending || isUploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isPending || isUploading ? "Salvando..." : "Cadastrar Paciente"}
                    </Button>
                </div>
            </form>
        </DialogContent >
    )
}