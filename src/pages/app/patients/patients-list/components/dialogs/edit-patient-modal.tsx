import '../../register-patients/form-components.css'
import { useEffect, useRef, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  UserPen,
} from 'lucide-react'

import { useFileSelection } from '@/hooks/use-file-selection'
import { useFormSteps } from '@/hooks/use-form-steps'
import { usePatient } from '@/hooks/use-patient'
import { getGroupedFields } from '@/utils/get-grouped-schema-fields'

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { cn } from '@/lib/utils'

import {
  updatePatientSchema,
  type UpdatePatientFormData,
} from '@/validators/patients/form/update-patient-schema'
import {
  STEPS,
  MAX_DOC_FILES,
  MAX_DOC_SIZE,
  type IRegisterPatientTabs,
} from '../../register-patients/constants'
import { StepBasicData } from '../../register-patients/steps/step-basic-data'
import { StepContactAddress } from '../../register-patients/steps/step-contact-address'
import { AttachmentsList } from '../../register-patients/steps/attachments-list'
import { UploadZone } from '../../register-patients/steps/upload-zone'
import { useUpdatePatient } from '../../register-patients/hooks/use-update-patient'
import { buildPatientUpdateDefaults } from './edit-patient-modal.helpers'

interface EditPatientModalProps {
  patientId: string
}

type IgroupField = Record<IRegisterPatientTabs, string[]>

export function EditPatientModal({ patientId }: EditPatientModalProps) {
  const { patient } = usePatient(patientId)

  const redirectedToError = useRef(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const { files, addFiles, removeFile, clearFiles } = useFileSelection({
    maxFiles: MAX_DOC_FILES,
    maxSizeBytes: MAX_DOC_SIZE,
  })

  const methods = useForm<UpdatePatientFormData>({
    resolver: zodResolver(
      updatePatientSchema,
    ) as Resolver<UpdatePatientFormData>,
  })

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods

  const {
    step: currentStep,
    handleNext,
    handleBack,
    goToStep,
    isFirstStep,
    isLastStep,
  } = useFormSteps()

  const { submit, isSubmitting } = useUpdatePatient({
    patientId,
    avatarFile,
    files,
    onSuccess: () => {
      reset()
      goToStep(1)
      clearFiles()
      setAvatarFile(null)
    },
  })

  const isPatientLoading = !patient

  const findStepClassName = (active: boolean, done: boolean): string => {
    if (active) return 'rp-modal-tab-badge--active'
    return done ? 'rp-modal-tab-badge--done' : 'rp-modal-tab-badge--pending'
  }

  const renderStepContent = (currentStepId: number) => {
    switch (currentStepId) {
      case 1: {
        return (
          <StepBasicData onAvatarSelect={setAvatarFile} patient={patient} />
        )
      }
      case 2: {
        return <StepContactAddress />
      }
      case 3: {
        return (
          <div className="space-y-5">
            <AttachmentsList patientId={patient?.id ?? null} />
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

  const renderButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Salvando…</span>
        </>
      )
    }

    if (!isLastStep) {
      return (
        <>
          <span>Continuar</span>
          <ChevronRight className="size-4" />
        </>
      )
    }

    return (
      <>
        <span>Salvar alterações</span>
        <Check className="size-4" />
      </>
    )
  }

  useEffect(() => {
    ;(async () => {
      if (errors && !redirectedToError.current) {
        const firstErrorField = Object.keys(errors)[0]

        const initialState: IgroupField = {
          basicData: [],
          contact: [],
          documents: [],
        }

        const tabs = getGroupedFields<IRegisterPatientTabs>(
          initialState,
          updatePatientSchema,
        )

        const tabWithError = tabs.find((tab) =>
          tab.fields.includes(firstErrorField),
        )

        if (tabWithError) {
          const stepWithError = STEPS.find(
            ({ key }) => tabWithError.name === key,
          )
          if (stepWithError) goToStep(stepWithError.id)
          redirectedToError.current = true
        }
      }
    })()
  }, [errors])

  useEffect(() => {
    if (!patient) return

    methods.reset(buildPatientUpdateDefaults(patient))
  }, [patient])

  return (
    <DialogContent
      className="rp-modal"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="rp-modal-header">
        <div className="rp-modal-icon-box">
          <UserPen className="text-blue-600" />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="rp-modal-title">Editar paciente</h2>
          <p className="rp-modal-subtitle">
            {patient
              ? `Atualize os dados de ${patient.firstName}. Mudanças salvam automaticamente ao avançar.`
              : 'Carregando dados do paciente…'}
          </p>
        </div>
      </DialogTitle>

      <div className="rp-modal-stepper">
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
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>

      <Form {...methods}>
        <div className="rp-modal-body">{renderStepContent(currentStep)}</div>

        <DialogFooter className="rp-modal-footer">
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
          <DialogClose>
            <Button
              type="button"
              variant="outline"
              className="rp-btn-secondary"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="rp-btn-primary"
            disabled={isSubmitting || isPatientLoading}
            onClick={isLastStep ? handleSubmit(submit) : handleNext}
          >
            {renderButtonContent()}
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  )
}
