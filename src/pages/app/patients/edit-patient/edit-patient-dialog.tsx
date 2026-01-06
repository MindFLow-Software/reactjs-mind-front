"use client"

import { useState, useRef } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    CalendarIcon,
    Loader2,
    Upload,
    Eye,
    EyeOff,
    Mars,
    Venus,
    Users,
    Camera
} from "lucide-react"
import { toast } from "sonner"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label" // Corrigido: Removido o import do recharts
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"
import { updatePatient, type UpdatePatientData } from "@/api/upadate-patient"
import { api } from "@/lib/axios"

// COMPONENTES REFATORADOS
import { AttachmentsList } from "./attachments-list"
import { UploadZone } from "./upload-zone"

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

interface FormErrors {
    firstName?: boolean
    lastName?: boolean
    email?: boolean
    password?: boolean
    dateOfBirth?: boolean
    cpf?: boolean
    phoneNumber?: boolean
}

interface EditPatientProps {
    patient: UpdatePatientData
    onClose?: () => void
}

export function EditPatient({ patient, onClose }: EditPatientProps) {
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [date, setDate] = useState<Date | undefined>(patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined)
    const [cpf, setCpf] = useState(patient.cpf ? formatCPF(patient.cpf) : "")
    const [phone, setPhone] = useState(patient.phoneNumber ? formatPhone(patient.phoneNumber) : "")
    const [gender, setGender] = useState(patient.gender || "FEMININE")

    const [showPassword, setShowPassword] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(patient.profileImageUrl || null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [errors, setErrors] = useState<FormErrors>({})
    const [isUploading, setIsUploading] = useState(false)

    const { mutateAsync: updatePatientFn, isPending } = useMutation({
        mutationFn: updatePatient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patients"] })
            queryClient.invalidateQueries({ queryKey: ["attachments", patient.id] })
            toast.success("Dados atualizados com sucesso!")
            onClose?.()
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Erro ao atualizar paciente.")
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setPreviewImage(reader.result as string)
            reader.readAsDataURL(file)
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.currentTarget
        const fd = new FormData(form)

        // Lógica de validação...
        const newErrors: FormErrors = {}
        if (!(fd.get("firstName"))) newErrors.firstName = true
        if (!(fd.get("lastName"))) newErrors.lastName = true
        if (!date) newErrors.dateOfBirth = true
        if (cpf.replace(/\D/g, "").length < 11) newErrors.cpf = true

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Verifique os campos obrigatórios.")
            return
        }

        try {
            setIsUploading(true)
            let attachmentIds: string[] = []

            if (selectedFiles.length > 0) {
                attachmentIds = await Promise.all(
                    selectedFiles.map(async (file) => {
                        const formData = new FormData()
                        formData.append('file', file)
                        const response = await api.post<{ attachmentId: string }>("/attachments", formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        })
                        return response.data.attachmentId
                    })
                )
            }

            await updatePatientFn({
                id: patient.id,
                firstName: fd.get("firstName") as string,
                lastName: fd.get("lastName") as string,
                email: (fd.get("email") as string) || undefined,
                password: (fd.get("password") as string) || undefined,
                phoneNumber: phone.replace(/\D/g, ""),
                profileImageUrl: previewImage || undefined,
                dateOfBirth: date!,
                cpf: cpf.replace(/\D/g, ""),
                gender: gender as any,
                attachmentIds,
            })
        } catch (error) {
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl">
            <DialogHeader>
                <DialogTitle>Editar Paciente</DialogTitle>
                <DialogDescription>
                    Atualize as informações do prontuário de {patient.firstName}.
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                {/* SEÇÃO AVATAR */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-24 w-24 border-2 border-dashed border-muted-foreground/20 group-hover:border-primary/40 transition-colors">
                            <AvatarImage src={previewImage || ""} className="object-cover" />
                            <AvatarFallback className="bg-muted/50">
                                <Camera className="h-8 w-8 text-muted-foreground/60" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-sm">
                            <Upload className="h-3 w-3" />
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="border-t border-muted/40 my-2" />

                {/* DADOS PESSOAIS */}
                <div className="space-y-4">
                    <h3 className="text-[13px] font-bold uppercase tracking-wide text-foreground/70 px-1">Dados Pessoais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                            <Input id="firstName" name="firstName" defaultValue={patient.firstName} className={cn(errors.firstName && "border-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                            <Input id="lastName" name="lastName" defaultValue={patient.lastName} className={cn(errors.lastName && "border-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cpf" className={cn(errors.cpf && "text-red-500")}>CPF *</Label>
                            <Input id="cpf" name="cpf" maxLength={14} value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} className={cn(errors.cpf && "border-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label className={cn(errors.dateOfBirth && "text-red-500")}>Data de Nascimento *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", errors.dateOfBirth && "border-red-500 text-red-500")}>
                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                        {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : <span>Selecione</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" captionLayout="dropdown" selected={date} onSelect={setDate} locale={ptBR} fromYear={1900} toYear={new Date().getFullYear()} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* CONTATO E ACESSO (Com a linha border-t) */}
                <div className="space-y-4 pt-6 border-t border-muted/40">
                    <h3 className="text-[13px] font-bold uppercase tracking-wide text-foreground/70 px-1">Contato e Acesso</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Telefone *</Label>
                            <Input id="phoneNumber" name="phoneNumber" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label>Gênero</Label>
                            <Select value={gender} onValueChange={(val) => setGender(val as any)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FEMININE"><div className="flex items-center gap-2"><Venus className="h-4 w-4 text-rose-400" /> Feminino</div></SelectItem>
                                    <SelectItem value="MASCULINE"><div className="flex items-center gap-2"><Mars className="h-4 w-4 text-blue-400" /> Masculino</div></SelectItem>
                                    <SelectItem value="OTHER"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-violet-400" /> Outro</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input id="email" name="email" type="email" defaultValue={patient.email} />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="password">Senha (Opcional)</Label>
                            <div className="relative">
                                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Manter atual" className="pr-10" />
                                <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground/60" /> : <Eye className="h-4 w-4 text-muted-foreground/60" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SEÇÃO DE ARQUIVOS (Refatorada) --- */}

                {/* 1. Arquivos salvos no Banco (Sem linha no topo para não duplicar se houver border-t na seção anterior) */}
                <div className="pt-2">
                    <AttachmentsList patientId={patient.id} />
                </div>

                {/* 2. Área de novos uploads (Esta já possui a linha border-t interna conforme o padrão Soft) */}
                <UploadZone selectedFiles={selectedFiles} onFilesChange={setSelectedFiles} />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isPending || isUploading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-md">
                        {(isPending || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending || isUploading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}