import { useState, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, isValid, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    Loader2, CalendarIcon, Venus, Mars, Users,
    UserRound, Camera, FileText, Stethoscope, MapPin,
    Phone, Mail,
} from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { IMaskMixin } from "react-imask"

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

import { registerPatients } from "@/api/create-patients"
import { updatePatients } from "@/api/upadate-patient"
import { cn } from "@/lib/utils"

import { UploadZone } from "./upload-zone"
import { AttachmentsList } from "./attachments-list"
import { uploadAttachment, uploadAvatar } from "@/api/attachments"

// ── Helpers ────────────────────────────────────────────────────────────────
function isValidCPF(cpf: string): boolean {
    const c = cpf.replace(/\D/g, "")
    if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false
    let sum = 0, rem: number
    for (let i = 1; i <= 9; i++) sum += parseInt(c[i - 1]) * (11 - i)
    rem = (sum * 10) % 11
    if (rem === 10 || rem === 11) rem = 0
    if (rem !== parseInt(c[9])) return false
    sum = 0
    for (let i = 1; i <= 10; i++) sum += parseInt(c[i - 1]) * (12 - i)
    rem = (sum * 10) % 11
    if (rem === 10 || rem === 11) rem = 0
    return rem === parseInt(c[10])
}

const patientSchema = z.object({
    firstName: z.string()
        .min(1, "Nome é obrigatório")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Apenas letras são permitidas"),
    lastName: z.string()
        .min(1, "Sobrenome é obrigatório")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Apenas letras são permitidas"),
    phoneNumber: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    dateOfBirth: z.date().nullable().optional()
        .refine((d) => !d || d <= new Date(), { message: "Data de nascimento inválida" }),
    cpf: z.string().optional().or(z.literal("")).refine(
        (v) => !v || isValidCPF(v), { message: "CPF inválido" }
    ),
    gender: z.enum(["FEMININE", "MASCULINE", "OTHER"]),
})

type PatientFormData = z.infer<typeof patientSchema>

const MaskedInput = IMaskMixin(({ inputRef, ...props }: any) => (
    <Input ref={inputRef} {...props} />
))

// ── Step config ────────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, label: "Dados básicos",      icon: UserRound },
    { id: 2, label: "Contato & endereço", icon: MapPin },
    { id: 3, label: "Clínico",            icon: Stethoscope },
    { id: 4, label: "Documentos",         icon: FileText },
] as const

type StepId = 1 | 2 | 3 | 4

const STEP_FIELDS: Record<StepId, (keyof PatientFormData)[]> = {
    1: ["firstName", "lastName", "cpf", "dateOfBirth", "gender"],
    2: ["phoneNumber", "email"],
    3: [],
    4: [],
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionLabel({
    label,
    letter,
    icon: Icon,
}: {
    label: string
    letter?: string
    icon?: React.ElementType
}) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                {Icon ? <Icon className="h-3 w-3" /> : letter}
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
            </span>
        </div>
    )
}

// ── Gender button group ────────────────────────────────────────────────────
const GENDER_OPTIONS = [
    {
        value: "FEMININE",
        label: "Feminino",
        icon: Venus,
        active: "border-pink-400 bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-500",
        hover:  "hover:border-pink-300 hover:text-pink-600",
    },
    {
        value: "MASCULINE",
        label: "Masculino",
        icon: Mars,
        active: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500",
        hover:  "hover:border-blue-300 hover:text-blue-600",
    },
    {
        value: "OTHER",
        label: "Outro / Prefiro não dizer",
        icon: Users,
        active: "border-zinc-400 bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-500",
        hover:  "hover:border-zinc-300 hover:text-zinc-600",
    },
] as const

function GenderButtonGroup({
    value,
    onChange,
}: {
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {GENDER_OPTIONS.map((opt) => {
                const Icon = opt.icon
                const active = value === opt.value
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
                            active
                                ? opt.active
                                : cn("border-border bg-background text-muted-foreground", opt.hover)
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {opt.label}
                    </button>
                )
            })}
        </div>
    )
}

// ── Avatar upload (inline, matching design) ────────────────────────────────
function AvatarUploadRow({
    onFileSelect,
    defaultValue,
}: {
    onFileSelect: (file: File | null) => void
    defaultValue?: string | null
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)

    function handleFile(file: File) {
        const url = URL.createObjectURL(file)
        setPreview(url)
        onFileSelect(file)
    }

    function handleRemove() {
        setPreview(null)
        onFileSelect(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const imgSrc = preview ?? (defaultValue?.startsWith("data:") ? defaultValue : null)

    return (
        <div className="flex items-center gap-4">
            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
                    imgSrc
                        ? "bg-transparent"
                        : "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/40"
                )}
            >
                {imgSrc ? (
                    <img src={imgSrc} alt="Foto" className="h-full w-full rounded-full object-cover" />
                ) : (
                    <UserRound className="h-7 w-7 text-blue-500" />
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity hover:opacity-100">
                    <Camera className="h-4 w-4 text-white" />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">Foto do paciente</span>
                <span className="text-xs text-muted-foreground">JPG ou PNG · até 2MB · opcional</span>
                <div className="flex items-center gap-2 mt-0.5">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        Enviar foto
                    </button>
                    {imgSrc && (
                        <>
                            <span className="text-muted-foreground/40">·</span>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="text-xs font-medium text-muted-foreground hover:text-destructive cursor-pointer"
                            >
                                Remover
                            </button>
                        </>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
        </div>
    )
}

// ── Step indicator ─────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: StepId }) {
    return (
        <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
                const done    = step.id < current
                const active  = step.id === current
                return (
                    <div key={step.id} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                                active ? "bg-blue-600 text-white"
                                    : done ? "bg-emerald-500 text-white"
                                    : "bg-muted text-muted-foreground"
                            )}>
                                {step.id}
                            </div>
                            <span className={cn(
                                "hidden sm:block text-xs font-medium whitespace-nowrap",
                                active ? "text-blue-600 font-semibold"
                                    : done ? "text-muted-foreground"
                                    : "text-muted-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={cn(
                                "mx-2 h-px w-8 sm:w-12 shrink-0",
                                done ? "bg-emerald-300 dark:bg-emerald-700" : "bg-border"
                            )} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

// ── Main component ─────────────────────────────────────────────────────────
interface RegisterPatientsProps {
    patient?: any
    onSuccess?: () => void
}

export function RegisterPatients({ patient, onSuccess }: RegisterPatientsProps) {
    const isEditMode   = !!patient
    const queryClient  = useQueryClient()
    const [step, setStep]              = useState<StepId>(1)
    const [avatarFile, setAvatarFile]  = useState<File | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isUploading, setIsUploading]     = useState(false)
    const [calendarOpen, setCalendarOpen]   = useState(false)

    const {
        register, handleSubmit, control, reset, trigger,
        formState: { errors },
    } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        mode: "onChange",
        defaultValues: {
            firstName:   patient?.firstName   ?? "",
            lastName:    patient?.lastName    ?? "",
            phoneNumber: patient?.phoneNumber ?? "",
            email:       patient?.email       ?? "",
            cpf:         patient?.cpf         ?? "",
            gender:      patient?.gender      ?? "FEMININE",
            dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : null,
        },
    })

    const { mutateAsync: savePatientFn, isPending } = useMutation({
        mutationFn: (data: any) => isEditMode ? updatePatients(data) : registerPatients(data),
    })

    async function handleNext() {
        const fields = STEP_FIELDS[step]
        const valid  = fields.length === 0 || await trigger(fields)
        if (valid && step < 4) setStep((s) => (s + 1) as StepId)
    }

    function handleBack() {
        if (step > 1) setStep((s) => (s - 1) as StepId)
    }

    async function onSubmit(data: PatientFormData) {
        try {
            setIsUploading(true)

            const patientResponse = await savePatientFn({
                ...data,
                id:          patient?.id,
                phoneNumber: data.phoneNumber ? data.phoneNumber.replace(/\D/g, "") : undefined,
                email:       data.email || undefined,
                dateOfBirth: data.dateOfBirth || undefined,
                cpf:         data.cpf ? data.cpf.replace(/\D/g, "") : undefined,
                gender:      data.gender as any,
                role:        "PATIENT" as any,
                isActive:    true,
                expertise:   "OTHER" as any,
            })

            const targetId = isEditMode ? patient.id : (patientResponse?.id || patientResponse?.patientId)
            if (!targetId) throw new Error("ID não identificado")

            if (avatarFile) await uploadAvatar(avatarFile, targetId)
            for (const file of selectedFiles) await uploadAttachment(file, targetId)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["patients"] }),
                queryClient.invalidateQueries({ queryKey: ["patient", targetId] }),
                queryClient.invalidateQueries({ queryKey: ["attachments", targetId] }),
            ])

            toast.success(isEditMode ? "Prontuário atualizado!" : "Paciente cadastrado com sucesso!")
            setAvatarFile(null)
            setSelectedFiles([])
            if (!isEditMode) reset()
            onSuccess?.()

        } catch (error) {
            console.error(error)
            let msg = "Erro ao salvar. Verifique a conexão e os arquivos."
            if (error instanceof AxiosError) msg = error.response?.data?.message || msg
            toast.error(msg)
        } finally {
            setIsUploading(false)
        }
    }

    const isBusy    = isPending || isUploading
    const isLastStep = step === 4

    return (
        <DialogContent className="w-full max-w-3xl max-h-[95vh] overflow-y-auto sm:rounded-2xl gap-0 p-0">
            {/* Header */}
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
                        <UserRound className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <DialogTitle className="text-base font-semibold leading-tight">
                            {isEditMode ? "Editar paciente" : "Cadastrar paciente"}
                        </DialogTitle>
                        <DialogDescription className="text-xs mt-0.5">
                            {isEditMode
                                ? `Atualize as informações de ${patient.firstName}.`
                                : "Comece apenas com nome e contato — o resto pode ser preenchido depois."}
                        </DialogDescription>
                    </div>
                </div>

                {/* Step indicator */}
                <div className="mt-4 overflow-x-auto pb-1">
                    <StepIndicator current={step} />
                </div>
            </DialogHeader>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6 py-5 space-y-6 min-h-[320px]">

                    {/* ── Step 1: Dados básicos ── */}
                    {step === 1 && (
                        <>
                            {/* Avatar */}
                            <AvatarUploadRow
                                onFileSelect={setAvatarFile}
                                defaultValue={patient?.profileImageUrl}
                            />

                            <div className="space-y-5">
                                {/* Identificação */}
                                <div>
                                    <SectionLabel letter="A" label="Identificação" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="firstName" className={cn("text-xs", errors.firstName && "text-red-500")}>
                                                Nome <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                {...register("firstName")}
                                                placeholder="Ex: Ana Luisa"
                                                autoComplete="given-name"
                                                className={cn(errors.firstName && "border-red-500 focus-visible:ring-red-500")}
                                            />
                                            {errors.firstName && (
                                                <p role="alert" className="text-[11px] text-red-500">{errors.firstName.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="lastName" className={cn("text-xs", errors.lastName && "text-red-500")}>
                                                Sobrenome <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="lastName"
                                                {...register("lastName")}
                                                placeholder="Ex: Costa"
                                                autoComplete="family-name"
                                                className={cn(errors.lastName && "border-red-500 focus-visible:ring-red-500")}
                                            />
                                            {errors.lastName && (
                                                <p role="alert" className="text-[11px] text-red-500">{errors.lastName.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Dados pessoais */}
                                <div>
                                    <SectionLabel letter="B" label="Dados Pessoais" />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="cpf" className={cn("text-xs", errors.cpf && "text-red-500")}>CPF</Label>
                                                <span className="text-[10px] text-muted-foreground">Verificação automática</span>
                                            </div>
                                            <Controller
                                                name="cpf"
                                                control={control}
                                                render={({ field: { ref, onChange, value, ...f } }) => (
                                                    <MaskedInput
                                                        {...f}
                                                        id="cpf"
                                                        inputRef={ref}
                                                        value={value}
                                                        onAccept={(v: string) => onChange(v)}
                                                        mask="000.000.000-00"
                                                        placeholder="000.000.000-00"
                                                        spellCheck={false}
                                                        className={cn("tabular-nums", errors.cpf && "border-red-500 focus-visible:ring-red-500")}
                                                    />
                                                )}
                                            />
                                            {errors.cpf && (
                                                <p role="alert" className="text-[11px] text-red-500">{errors.cpf.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="dateOfBirth" className={cn("text-xs", errors.dateOfBirth && "text-red-500")}>
                                                Nascimento
                                            </Label>
                                            <Controller
                                                name="dateOfBirth"
                                                control={control}
                                                render={({ field }) => {
                                                    const [inputValue, setInputValue] = useState(
                                                        field.value ? format(field.value, "dd/MM/yyyy") : ""
                                                    )
                                                    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
                                                        let val = e.target.value.replace(/\D/g, "")
                                                        if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2)
                                                        if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 10)
                                                        setInputValue(val)
                                                        if (val.length === 10) {
                                                            const parsed = parse(val, "dd/MM/yyyy", new Date())
                                                            field.onChange(isValid(parsed) ? parsed : null)
                                                        } else if (val.length === 0) field.onChange(null)
                                                    }
                                                    return (
                                                        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                                            <div className="relative">
                                                                <Input
                                                                    id="dateOfBirth"
                                                                    placeholder="DD/MM/AAAA"
                                                                    value={inputValue}
                                                                    onChange={handleInputChange}
                                                                    maxLength={10}
                                                                    autoComplete="off"
                                                                    spellCheck={false}
                                                                    className={cn("pr-10 tabular-nums", errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500")}
                                                                />
                                                                <PopoverTrigger asChild>
                                                                    <button
                                                                        type="button"
                                                                        aria-label="Abrir calendário"
                                                                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground cursor-pointer"
                                                                    >
                                                                        <CalendarIcon className="h-4 w-4" aria-hidden="true" />
                                                                    </button>
                                                                </PopoverTrigger>
                                                            </div>
                                                            <PopoverContent className="w-auto overflow-hidden p-0" align="center" sideOffset={8}>
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={field.value ?? undefined}
                                                                    captionLayout="dropdown"
                                                                    fromYear={1900}
                                                                    toYear={new Date().getFullYear()}
                                                                    disabled={(d) => d > new Date()}
                                                                    onSelect={(d) => {
                                                                        field.onChange(d)
                                                                        if (d) setInputValue(format(d, "dd/MM/yyyy"))
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
                                                <p role="alert" className="text-[11px] text-red-500">{errors.dateOfBirth.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-1.5">
                                        <Label className="text-xs">Gênero</Label>
                                        <Controller
                                            name="gender"
                                            control={control}
                                            render={({ field }) => (
                                                <GenderButtonGroup value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Step 2: Contato & endereço ── */}
                    {step === 2 && (
                        <div className="space-y-6">
                            {/* CONTATO — functional (API consumes phoneNumber + email) */}
                            <div>
                                <SectionLabel icon={Phone} label="Contato" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="phoneNumber" className="text-xs">Celular</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                            <Controller
                                                name="phoneNumber"
                                                control={control}
                                                render={({ field: { ref, onChange, value, ...f } }) => (
                                                    <MaskedInput
                                                        {...f}
                                                        id="phoneNumber"
                                                        inputRef={ref}
                                                        value={value}
                                                        onAccept={(v: string) => onChange(v)}
                                                        mask="(00) 00000-0000"
                                                        placeholder="(00) 00000-0000"
                                                        type="tel"
                                                        autoComplete="tel"
                                                        className="pl-9 tabular-nums"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className={cn("text-xs", errors.email && "text-red-500")}>
                                            E-mail
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                            <Input
                                                id="email"
                                                {...register("email")}
                                                type="email"
                                                placeholder="paciente@email.com"
                                                autoComplete="email"
                                                className={cn("pl-9", errors.email && "border-red-500 focus-visible:ring-red-500")}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p role="alert" className="text-[11px] text-red-500">{errors.email.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ENDEREÇO — visual only, API does not consume these yet */}
                            <div>
                                <SectionLabel icon={MapPin} label="Endereço" />
                                <div className="space-y-3 opacity-60 pointer-events-none select-none" aria-hidden="true">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs">CEP</Label>
                                                <span className="text-[10px] text-muted-foreground">preenche automático</span>
                                            </div>
                                            <Input placeholder="00000-000" className="tabular-nums" disabled />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Logradouro</Label>
                                            <Input placeholder="Rua, número" disabled />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Bairro</Label>
                                            <Input placeholder="Bairro" disabled />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Cidade</Label>
                                            <Input placeholder="Cidade" disabled />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">UF</Label>
                                            <Input placeholder="—" disabled />
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-[10px] text-muted-foreground/60">Endereço disponível em breve</p>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3: Clínico ── */}
                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <Stethoscope className="h-6 w-6 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm font-medium">Informações clínicas</p>
                            <p className="text-xs text-muted-foreground max-w-xs">
                                Campos clínicos como diagnóstico, CID e plano terapêutico estarão disponíveis em breve.
                            </p>
                        </div>
                    )}

                    {/* ── Step 4: Documentos ── */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <SectionLabel letter="A" label="Documentos" />
                            {isEditMode && (
                                <div className="rounded-lg border border-dashed bg-muted/30 p-3">
                                    <AttachmentsList patientId={patient.id} />
                                </div>
                            )}
                            <UploadZone
                                selectedFiles={selectedFiles}
                                onFilesChange={setSelectedFiles}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 border-t px-6 py-4">
                    <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Tab</kbd>
                        <span>próximo</span>
                        <span className="mx-1">·</span>
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Ctrl</kbd>
                        <span>+</span>
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
                        <span>salvar</span>
                        <span className="mx-1">·</span>
                        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
                        <span>cancelar</span>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="cursor-pointer"
                            >
                                Voltar
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onSuccess?.()}
                            className="cursor-pointer"
                        >
                            Cancelar
                        </Button>

                        {isLastStep ? (
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isBusy}
                                className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {isBusy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                {isBusy ? "Salvando…" : (isEditMode ? "Salvar alterações" : "Cadastrar paciente")}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleNext}
                                className="cursor-pointer gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Continuar
                                <span aria-hidden="true">›</span>
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </DialogContent>
    )
}
