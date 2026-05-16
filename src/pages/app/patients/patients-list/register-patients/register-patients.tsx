import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, parse as dateParse, isValid as dateIsValid } from "date-fns"
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"
import type { ChangeEvent } from "react"

import { DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { createPatients, type CreatePatientsInput } from "@/api/create-patients"
import { updatePatients, type UpdatePatientData } from "@/api/upadate-patient"
import { uploadAttachment, uploadAvatar } from "@/api/attachments"

import type { PatientHTTP } from "@/types/patient"
import { patientSchema, type PatientFormData } from "@/validators/patients"
import { STEPS, type StepId } from "./constants"
import { StepBasicData } from "./steps/step-basic-data"
import { StepContactAddress } from "./steps/step-contact-address"
import { StepClinical } from "./steps/step-clinical"
import { AttachmentsList } from "./steps/attachments-list"
import { UploadZone } from "./steps/upload-zone"

interface RegisterPatientsProps {
    patient?:   PatientHTTP
    onSuccess?: () => void
}

export function RegisterPatients({ patient, onSuccess }: RegisterPatientsProps) {
    const isEditMode  = !!patient
    const queryClient = useQueryClient()

    // ── Stepper ───────────────────────────────────────────────────────────────
    const [step, setStep] = useState<StepId>(1)

    // ── File state ────────────────────────────────────────────────────────────
    const [avatarFile,    setAvatarFile]    = useState<File | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isUploading,   setIsUploading]   = useState(false)

    // ── Birth input (DD/MM/AAAA string kept separate from form Date) ──────────
    const [birthInput, setBirthInput] = useState(() => {
        if (!patient?.dateOfBirth) return ""
        try { return format(new Date(patient.dateOfBirth), "dd/MM/yyyy") } catch { return "" }
    })

    // ── Visual-only clinical/address fields (not yet in API) ──────────────────
    const [modality,  setModality]  = useState("ONLINE")
    const [frequency, setFrequency] = useState("Semanal")
    const [price,     setPrice]     = useState("")
    const [source,    setSource]    = useState("")
    const [notes,     setNotes]     = useState("")
    const [cep,       setCep]       = useState("")
    const [street,    setStreet]    = useState("")
    const [district,  setDistrict]  = useState("")
    const [city,      setCity]      = useState("")
    const [uf,        setUf]        = useState("")

    // ── Form ──────────────────────────────────────────────────────────────────
    const {
        register, handleSubmit, control, reset, trigger, watch,
        formState: { errors },
    } = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        mode: "onTouched",
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

    // ── Mutations ─────────────────────────────────────────────────────────────
    const { mutateAsync: savePatientFn, isPending } = useMutation({
        mutationFn: (data: CreatePatientsInput | UpdatePatientData) =>
            isEditMode
                ? updatePatients(data as UpdatePatientData)
                : createPatients(data as CreatePatientsInput),
    })

    // ── Handlers ──────────────────────────────────────────────────────────────
    const cpfDigits = (watch("cpf") ?? "").replace(/\D/g, "")

    function handleBirthChange(e: ChangeEvent<HTMLInputElement>, fieldOnChange: (v: Date | null) => void) {
        let v = e.target.value.replace(/\D/g, "").slice(0, 8)
        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2)
        if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5)
        setBirthInput(v)
        if (v.length === 10) {
            const d = dateParse(v, "dd/MM/yyyy", new Date())
            fieldOnChange(dateIsValid(d) ? d : null)
        } else {
            fieldOnChange(null)
        }
    }

    function handleCepChange(e: ChangeEvent<HTMLInputElement>) {
        let v = e.target.value.replace(/\D/g, "").slice(0, 8)
        if (v.length > 5) v = v.slice(0, 5) + "-" + v.slice(5)
        setCep(v)
    }

    function handlePriceChange(e: ChangeEvent<HTMLInputElement>) {
        const digits = e.target.value.replace(/\D/g, "")
        if (!digits) { setPrice(""); return }
        setPrice((parseInt(digits) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
    }

    async function handleNext() {
        const fields: (keyof PatientFormData)[] =
            step === 1 ? ["firstName", "lastName", "cpf", "dateOfBirth", "gender"] :
            step === 2 ? ["phoneNumber", "email"] : []
        const valid = fields.length === 0 || await trigger(fields)
        if (valid && step < 4) setStep((s) => (s + 1) as StepId)
    }

    async function onSubmit(data: PatientFormData) {
        try {
            setIsUploading(true)
            const basePayload = {
                firstName:   data.firstName,
                lastName:    data.lastName,
                gender:      data.gender,
                phoneNumber: data.phoneNumber?.replace(/\D/g, "") || undefined,
                email:       data.email || undefined,
                dateOfBirth: data.dateOfBirth || undefined,
                cpf:         data.cpf?.replace(/\D/g, "") || undefined,
            }
            const res = await savePatientFn(
                isEditMode
                    ? { ...basePayload, id: patient!.id }
                    : basePayload
            )
            const targetId = isEditMode ? patient!.id : ((res as { id?: string; patientId?: string })?.id || (res as { id?: string; patientId?: string })?.patientId)
            if (!targetId) throw new Error("ID não identificado")

            if (avatarFile) await uploadAvatar(avatarFile, targetId)
            for (const f of selectedFiles) await uploadAttachment(f, targetId)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["patients"] }),
                queryClient.invalidateQueries({ queryKey: ["patient", targetId] }),
                queryClient.invalidateQueries({ queryKey: ["attachments", targetId] }),
            ])

            toast.success(isEditMode ? "Paciente atualizado!" : "Paciente cadastrado!")
            if (!isEditMode) { reset(); setBirthInput(""); setNotes(""); setPrice(""); setSource("") }
            setSelectedFiles([]); setAvatarFile(null)
            onSuccess?.()
        } catch (error) {
            toast.error(error instanceof AxiosError ? error.message : "Erro ao salvar. Verifique os dados.")
        } finally {
            setIsUploading(false)
        }
    }

    async function handleSubmitClick() {
        const valid = await trigger()
        if (valid) handleSubmit(onSubmit)()
    }

    const isBusy = isPending || isUploading
    const isLast = step === 4

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <DialogContent
            className="flex w-full max-w-[720px] flex-col gap-0 overflow-hidden p-0 sm:rounded-xl"
            style={{ maxHeight: "92vh" }}
        >
            {/* Header */}
            <div className="flex items-start gap-3.5 border-b border-slate-200 bg-white px-[22px] pb-[14px] pt-[18px]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-blue-100 bg-blue-50">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e6fd9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="font-title text-[18px] font-bold tracking-[-0.01em] text-slate-900">
                        {isEditMode ? "Editar paciente" : "Cadastrar paciente"}
                    </h2>
                    <p className="mt-0.5 max-w-[520px] text-[13px] text-slate-500">
                        {isEditMode
                            ? `Atualize os dados de ${patient!.firstName}. Mudanças salvam automaticamente ao avançar.`
                            : "Comece apenas com nome e contato — o resto pode ser preenchido depois."}
                    </p>
                </div>
            </div>

            {/* Tab stepper */}
            <div className="flex items-stretch border-b border-slate-200 bg-white px-[22px]">
                {STEPS.map((s) => {
                    const active = step === s.id
                    const done   = step > s.id
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setStep(s.id)}
                            className={cn(
                                "-mb-px flex cursor-pointer items-center gap-[7px] border-b-2 px-[14px] py-[10px] text-[13px] font-semibold transition-colors duration-[120ms]",
                                active ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
                            )}
                        >
                            <span className={cn(
                                "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                                active ? "bg-blue-600 text-white" : done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"
                            )}>
                                {s.id}
                            </span>
                            <span className="hidden sm:block">{s.label}</span>
                            {s.required && <span className="ml-0.5 text-[11px] text-red-600">*</span>}
                        </button>
                    )
                })}
            </div>

            {/* Progress bar */}
            <div className="h-[2px] shrink-0 bg-slate-100">
                <div
                    className="h-full bg-blue-600 transition-[width] duration-[240ms]"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-[22px] py-5">
                {step === 1 && (
                    <StepBasicData
                        register={register}
                        control={control}
                        errors={errors}
                        cpfDigits={cpfDigits}
                        birthInput={birthInput}
                        onBirthChange={handleBirthChange}
                        onAvatarSelect={setAvatarFile}
                        patient={patient}
                    />
                )}
                {step === 2 && (
                    <StepContactAddress
                        register={register}
                        control={control}
                        errors={errors}
                        cep={cep}           onCepChange={handleCepChange}
                        street={street}     onStreetChange={setStreet}
                        district={district} onDistrictChange={setDistrict}
                        city={city}         onCityChange={setCity}
                        uf={uf}             onUfChange={setUf}
                    />
                )}
                {step === 3 && (
                    <StepClinical
                        modality={modality}   onModalityChange={setModality}
                        frequency={frequency} onFrequencyChange={setFrequency}
                        price={price}         onPriceChange={handlePriceChange}
                        source={source}       onSourceChange={setSource}
                        notes={notes}         onNotesChange={setNotes}
                    />
                )}
                {step === 4 && (
                    <div className="space-y-5">
                        {isEditMode && <AttachmentsList patientId={patient!.id} />}
                        <UploadZone selectedFiles={selectedFiles} onFilesChange={setSelectedFiles} />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-[22px] py-[14px]">
                <div className="flex items-center justify-end gap-2.5">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep((s) => (s - 1) as StepId)}
                            className="flex cursor-pointer items-center gap-1 rounded-[6px] border border-slate-300 bg-white px-[14px] py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <ChevronLeft className="size-4" strokeWidth={2.5} />
                            Voltar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onSuccess?.()}
                        className="cursor-pointer rounded-[6px] border border-slate-300 bg-white px-[14px] py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={isLast ? handleSubmitClick : handleNext}
                        className="flex cursor-pointer items-center gap-2 rounded-[6px] bg-blue-600 px-[14px] py-2 text-[13px] font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-[0_4px_10px_rgba(30,111,217,.18)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isBusy && <Loader2 className="size-4 animate-spin" />}
                        {isBusy ? "Salvando…" : isLast ? (isEditMode ? "Salvar alterações" : "Cadastrar paciente") : "Continuar"}
                        {!isBusy && (isLast ? <Check className="size-4" /> : <ChevronRight className="size-4" />)}
                    </button>
                </div>
            </div>
        </DialogContent>
    )
}
