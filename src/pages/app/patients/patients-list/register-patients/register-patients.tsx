import './form-components.css'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useFileSelection } from '@/hooks/use-file-selection'
import { useCepLookup } from '@/hooks/use-cep-lookup'
import { usePatientFormSteps } from './hooks/use-patient-form-steps'
import { usePatientSubmit } from './hooks/use-patient-submit'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  UserPlus,
  UserPen,
} from 'lucide-react'

import { DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'

import { patientSchema, type PatientFormData } from '@/validators/patients'
import { buildPatientDefaults } from './helpers'
import { STEPS, MAX_DOC_FILES, MAX_DOC_SIZE } from './constants'
import { StepBasicData } from './steps/step-basic-data'
import { StepContactAddress } from './steps/step-contact-address'
import { StepClinical } from './steps/step-clinical'
import { AttachmentsList } from './steps/attachments-list'
import { UploadZone } from './steps/upload-zone'
import { usePatient } from '@/hooks/use-patient'

interface RegisterPatientsProps {
  patientId?: string
  isEditing?: boolean
  onSuccess?: () => void
}

export function RegisterPatients({
  patientId,
  isEditing,
  onSuccess,
}: RegisterPatientsProps) {
  const isEditMode = Boolean(isEditing)
  const { patient } = usePatient(patientId)

  const methods = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: 'onTouched',
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const { files, addFiles, removeFile, clearFiles } = useFileSelection({
    maxFiles: MAX_DOC_FILES,
    maxSizeBytes: MAX_DOC_SIZE,
  })

  const {
    step: currentStep,
    handleNext,
    handleBack,
    goToStep,
    isFirstStep,
    isLastStep,
  } = usePatientFormSteps({ trigger: methods.trigger })

  const { onCepChange, isCepLoading } = useCepLookup({
    setValue: methods.setValue,
  })

  const { submit, isSubmitting } = usePatientSubmit({
    patientId,
    avatarFile,
    files,
    onSuccess: () => {
      if (!isEditMode) {
        methods.reset()
        goToStep(1)
      }
      clearFiles()
      setAvatarFile(null)
      onSuccess?.()
    },
  })

  const isEditLoading = Boolean(patientId) && !patient

  useEffect(() => {
    const patientDefaults = buildPatientDefaults(patient)
    methods.reset(patientDefaults)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient])

  const findSubimtLabel = (): string => {
    if (isSubmitting) return 'Salvando…'
    if (!isLastStep) return 'Continuar'

    return isEditMode ? 'Salvar alterações' : 'Cadastrar paciente'
  }

  const findStepClassName = (active: boolean, done: boolean): string => {
    if (active) return 'rp-modal-tab-badge--active'
    return done ? 'rp-modal-tab-badge--done' : 'rp-modal-tab-badge--pending'
  }

  function renderStepContent(currentStepId: number) {
    switch (currentStepId) {
      case 1: {
        return (
          <StepBasicData
            key={patient?.id ?? 'new'}
            onAvatarSelect={setAvatarFile}
            patient={patient}
          />
        )
      }
      case 2: {
        return (
          <StepContactAddress
            onCepChange={onCepChange}
            isCepLoading={isCepLoading}
          />
        )
      }
      case 3: {
        return <StepClinical />
      }
      case 4: {
        return (
          <div className="space-y-5">
            {isEditMode && <AttachmentsList patientId={patient?.id ?? null} />}
            <UploadZone
              selectedFiles={files}
              onFilesChange={addFiles}
              onRemoveFile={removeFile}
            />
          </div>
        )
      }
    }
  }

  return (
    <DialogContent className="rp-modal">
      <DialogTitle className="rp-modal-header">
        <div className="rp-modal-icon-box">
          {isEditMode ? (
            <UserPen className="text-blue-600" />
          ) : (
            <UserPlus className="text-blue-600" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="rp-modal-title">
            {isEditMode ? 'Editar paciente' : 'Cadastrar paciente'}
          </h2>
          <p className="rp-modal-subtitle">
            {isEditMode
              ? `Atualize os dados de ${patient?.firstName}. Mudanças salvam automaticamente ao avançar.`
              : 'Comece apenas com nome e contato — o resto pode ser preenchido posteriormente.'}
          </p>
        </div>
      </DialogTitle>

      <div className="rp-modal-stepper">
        {/* ToDo: improve STEPS format, if applicable */}
        {STEPS.map((step) => {
          const active = currentStep === step.id
          const done = currentStep > step.id
          const stepClassName = findStepClassName(active, done)

          return (
            <button
              key={step.id}
              type="button"
              className="rp-modal-tab"
              onClick={() => goToStep(step.id)}
            >
              <span className={cn('rp-modal-tab-badge', stepClassName)}>
                {step.id}
              </span>
              <span>{step.label}</span>
              {step.required && (
                <span className="ml-0.5 text-[11px] text-red-600">*</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="rp-modal-progress-track">
        <div
          className="rp-modal-progress-fill"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      <Form {...methods}>
        <div className="rp-modal-body">{renderStepContent(currentStep)}</div>
      </Form>

      <div className="rp-modal-footer">
        <div className="flex items-center justify-end gap-2.5">
          {!isFirstStep && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="rp-btn-secondary"
            >
              <ChevronLeft className="size-4" strokeWidth={2.5} />
              Voltar
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess?.()}
            className="rp-btn-secondary"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isSubmitting || isEditLoading}
            onClick={
              isLastStep ? () => methods.handleSubmit(submit)() : handleNext
            }
            className="rp-btn-primary"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {findSubimtLabel()}
            {!isSubmitting &&
              (isLastStep ? (
                <Check className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              ))}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
