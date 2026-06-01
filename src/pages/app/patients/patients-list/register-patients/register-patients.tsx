import "./form-components.css"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useFileSelection } from "@/hooks/use-file-selection"
import { useCepLookup } from "@/hooks/use-cep-lookup"
import { usePatientFormSteps } from "./hooks/use-patient-form-steps"
import { usePatientSubmit } from "./hooks/use-patient-submit"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react"

import { DialogContent } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { cn } from "@/lib/utils"

import type { PatientHTTP } from "@/types/patient"
import { patientSchema, type PatientFormData } from "@/validators/patients"
import { buildPatientDefaults } from "./helpers"
import { STEPS, MAX_DOC_FILES, MAX_DOC_SIZE } from "./constants"
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
    const isEditMode = !!patient

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const { files: selectedFiles, addFiles, removeFile, clearFiles } = useFileSelection({
        maxFiles:     MAX_DOC_FILES,
        maxSizeBytes: MAX_DOC_SIZE,
    })

    const methods = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        mode: "onTouched",
        defaultValues: buildPatientDefaults(patient),
    })

    const { step, handleNext, handleBack, goToStep, isFirstStep, isLastStep } =
        usePatientFormSteps({ trigger: methods.trigger })

    const { onCepBlur, isCepLoading } = useCepLookup({ setValue: methods.setValue })

    const { submit, isSubmitting } = usePatientSubmit({
        patient,
        avatarFile,
        files: selectedFiles,
        onSuccess: () => {
            if (!isEditMode) methods.reset()
            clearFiles()
            setAvatarFile(null)
            onSuccess?.()
        },
    })

    return (
        <DialogContent className="rp-modal">
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

            <div className="rp-modal-stepper">
                {STEPS.map((s) => {
                    const active = step === s.id
                    const done   = step > s.id
                    return (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => goToStep(s.id)}
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

            <div className="rp-modal-progress-track">
                <div className="rp-modal-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
            </div>

            <Form {...methods}>
                <div className="rp-modal-body">
                    {step === 1 && <StepBasicData onAvatarSelect={setAvatarFile} patient={patient} />}
                    {step === 2 && <StepContactAddress onCepBlur={onCepBlur} isCepLoading={isCepLoading} />}
                    {step === 3 && <StepClinical />}
                    {step === 4 && (
                        <div className="space-y-5">
                            {isEditMode && <AttachmentsList patientId={patient!.id} />}
                            <UploadZone selectedFiles={selectedFiles} onFilesChange={addFiles} onRemoveFile={removeFile} />
                        </div>
                    )}
                </div>
            </Form>

            <div className="rp-modal-footer">
                <div className="flex items-center justify-end gap-2.5">
                    {!isFirstStep && (
                        <button type="button" onClick={handleBack} className="rp-btn-secondary">
                            <ChevronLeft className="size-4" strokeWidth={2.5} />
                            Voltar
                        </button>
                    )}
                    <button type="button" onClick={() => onSuccess?.()} className="rp-btn-secondary">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={isLastStep ? () => methods.handleSubmit(submit)() : handleNext}
                        className="rp-btn-primary"
                    >
                        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                        {isSubmitting ? "Salvando…" : isLastStep ? (isEditMode ? "Salvar alterações" : "Cadastrar paciente") : "Continuar"}
                        {!isSubmitting && (isLastStep ? <Check className="size-4" /> : <ChevronRight className="size-4" />)}
                    </button>
                </div>
            </div>
        </DialogContent>
    )
}
