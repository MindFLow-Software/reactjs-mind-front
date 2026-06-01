import "./form-components.css"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { toast } from "sonner"
import { AxiosError } from "axios"

import { DialogContent } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"

import { createPatients } from "@/api/patients/create-patient"
import { updatePatients } from "@/api/patients/update-patient"
import { uploadAttachment, uploadAvatar } from "@/api/attachments/attachments"
import { getAddressByCep } from "@/api/address/get-address-by-cep"

import type { PatientHTTP } from "@/types/patient"
import { patientSchema, type PatientFormData } from "@/validators/patients"
import { buildPatientDefaults } from "./helpers"
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
    const [isCepLoading,  setIsCepLoading]  = useState(false)

    // ── Form ──────────────────────────────────────────────────────────────────
    const methods = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        mode: "onTouched",
        defaultValues: buildPatientDefaults(patient),
    })

    // ── Mutations ─────────────────────────────────────────────────────────────
    const { mutateAsync: createFn, isPending: isCreating } = useMutation({
        mutationFn: createPatients,
    })

    const { mutateAsync: updateFn, isPending: isUpdating } = useMutation({
        mutationFn: updatePatients,
    })

    const isBusy = isCreating || isUpdating || isUploading
    const isLast = step === 4

    // ── Handlers ──────────────────────────────────────────────────────────────
    async function handleCepBlur() {
        const digits = (methods.getValues("cep") ?? "").replace(/\D/g, "")
        if (digits.length < 8) return
        try {
            setIsCepLoading(true)
            const address = await getAddressByCep(digits)
            methods.setValue("logradouro", address.logradouro)
            methods.setValue("bairro",     address.bairro)
            methods.setValue("cidade",     address.cidade)
            methods.setValue("uf",         address.uf)
        } catch (error) {
            const status = error instanceof AxiosError ? error.response?.status : null
            if (status === 400)      toast.error("CEP inválido")
            else if (status === 404) toast.error("CEP não encontrado")
            else                     toast.error("Serviço de CEP indisponível. Preencha manualmente.")
        } finally {
            setIsCepLoading(false)
        }
    }

    async function handleNext() {
        const fields: (keyof PatientFormData)[] =
            step === 1 ? ["firstName", "lastName", "cpf", "dateOfBirth", "gender"] :
            step === 2 ? ["phoneNumber", "email"] : []
        const valid = fields.length === 0 || await methods.trigger(fields)
        if (valid && step < 4) setStep((s) => (s + 1) as StepId)
    }

    async function onSubmit(data: PatientFormData) {
        const { modality, frequency, price, source, notes, email, dateOfBirth, phoneNumber, cpf, cep, logradouro, bairro, cidade, uf, ...coreFields } = data
        const shared = {
            ...coreFields,
            phoneNumber: phoneNumber || undefined,
            cpf:         cpf         || undefined,
            cep:         cep         || undefined,
            logradouro:  logradouro  || undefined,
            bairro:      bairro      || undefined,
            cidade:      cidade      || undefined,
            uf:          uf          || undefined,
            dateOfBirth: dateOfBirth || undefined,
        }
        try {
            setIsUploading(true)
            const res = isEditMode
                ? await updateFn({ ...shared, id: patient!.id })
                : await createFn({ ...shared, email: email || undefined })
            const targetId = isEditMode
                ? patient!.id
                : ((res as { id?: string; patientId?: string })?.id || (res as { id?: string; patientId?: string })?.patientId)
            if (!targetId) throw new Error("ID não identificado")

            if (avatarFile) await uploadAvatar(avatarFile, targetId)
            for (const f of selectedFiles) await uploadAttachment(f, targetId)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["patients"] }),
                queryClient.invalidateQueries({ queryKey: ["patient", targetId] }),
                queryClient.invalidateQueries({ queryKey: ["attachments", targetId] }),
            ])

            toast.success(isEditMode ? "Paciente atualizado!" : "Paciente cadastrado!")
            if (!isEditMode) methods.reset()
            setSelectedFiles([]); setAvatarFile(null)
            onSuccess?.()
        } catch (error) {
            toast.error(error instanceof AxiosError ? error.message : "Erro ao salvar. Verifique os dados.")
        } finally {
            setIsUploading(false)
        }
    }

    function handleSubmitClick() {
        methods.handleSubmit(onSubmit)()
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <DialogContent className="rp-modal">
            {/* Header */}
            <div className="rp-modal-header">
                <div className="rp-modal-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                </div>
                <div className="min-w-0 flex-1">
                    <h2 className="rp-modal-title">
                        {isEditMode ? "Editar paciente" : "Cadastrar paciente"}
                    </h2>
                    <p className="rp-modal-subtitle">
                        {isEditMode
                            ? `Atualize os dados de ${patient!.firstName}. Mudanças salvam automaticamente ao avançar.`
                            : "Comece apenas com nome e contato — o resto pode ser preenchido depois."}
                    </p>
                </div>
            </div>

            {/* Tab stepper */}
            <div className="rp-modal-stepper">
                {STEPS.map((s) => {
                    const active = step === s.id
                    const done   = step > s.id
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setStep(s.id)}
                            className={cn("rp-modal-tab", active ? "rp-modal-tab--active" : "rp-modal-tab--idle")}
                        >
                            <span className={cn(
                                "rp-modal-tab-badge",
                                active ? "rp-modal-tab-badge--active" : done ? "rp-modal-tab-badge--done" : "rp-modal-tab-badge--pending"
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
            <div className="rp-modal-progress-track">
                <div
                    className="rp-modal-progress-fill"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            {/* Body */}
            <Form {...methods}>
                <div className="rp-modal-body">
                    {step === 1 && (
                        <StepBasicData
                            onAvatarSelect={setAvatarFile}
                            patient={patient}
                        />
                    )}
                    {step === 2 && (
                        <StepContactAddress
                            onCepBlur={handleCepBlur}
                            isCepLoading={isCepLoading}
                        />
                    )}
                    {step === 3 && <StepClinical />}
                    {step === 4 && (
                        <div className="space-y-5">
                            {isEditMode && <AttachmentsList patientId={patient!.id} />}
                            <UploadZone selectedFiles={selectedFiles} onFilesChange={setSelectedFiles} />
                        </div>
                    )}
                </div>
            </Form>

            {/* Footer */}
            <div className="rp-modal-footer">
                <div className="flex items-center justify-end gap-2.5">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={() => setStep((s) => (s - 1) as StepId)}
                            className="rp-btn-secondary"
                        >
                            <ChevronLeft className="size-4" strokeWidth={2.5} />
                            Voltar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onSuccess?.()}
                        className="rp-btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isBusy}
                        onClick={isLast ? handleSubmitClick : handleNext}
                        className="rp-btn-primary"
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
