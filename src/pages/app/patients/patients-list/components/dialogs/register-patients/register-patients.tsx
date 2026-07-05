import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Check,
  Loader2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

import { useFormSteps } from '@/hooks/use-form-steps'
import { useCreatePatient } from './hooks/use-create-patient'
import { useFileSelection } from '@/hooks/use-file-selection'

import {
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogContent,
} from '@/components/ui/dialog'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import {
  createPatientSchema,
  type CreatePatientFormData,
} from '@/validators/patients/form/create-patient-schema'

import {
  STEPS,
  MAX_DOC_FILES,
  MAX_DOC_SIZE,
  type IRegisterPatientTabs,
} from './constants'

import { UploadZone } from './steps/upload-zone'
import { StepBasicData } from './steps/step-basic-data'
import { getGroupedFields } from '@/utils/get-grouped-schema-fields'
import { StepContactAddress } from './steps/step-contact-address'

import './form-components.css'

type IgroupField = Record<IRegisterPatientTabs, string[]>

export function RegisterPatients() {
  const redirectedToError = useRef(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const { files, addFiles, removeFile, clearFiles } = useFileSelection({
    maxFiles: MAX_DOC_FILES,
    maxSizeBytes: MAX_DOC_SIZE,
  })

  const methods = useForm<CreatePatientFormData>({
    resolver: zodResolver(createPatientSchema),
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
  } = useFormSteps({ stepsLength: STEPS.length })

  const { submit, isSubmitting } = useCreatePatient({
    avatarFile,
    files,
    onSuccess: () => {
      reset()
      goToStep(1)
      clearFiles()
      setAvatarFile(null)
    },
  })

  const findStepClassName = (active: boolean, done: boolean): string => {
    if (active) return 'rp-modal-tab-badge--active'
    return done ? 'rp-modal-tab-badge--done' : 'rp-modal-tab-badge--pending'
  }

  const renderStepContent = (currentStepId: number) => {
    switch (currentStepId) {
      case 1: {
        return <StepBasicData onAvatarSelect={setAvatarFile} patient={null} />
      }
      case 2: {
        return <StepContactAddress />
      }
      // case 3: {
      //   return <StepClinical />
      // }
      case 3: {
        return (
          <UploadZone
            selectedFiles={files}
            onFilesChange={addFiles}
            onRemoveFile={removeFile}
          />
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
        <span>Cadastrar paciente</span>
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
          createPatientSchema,
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

  return (
    <DialogContent
      className="rp-modal"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogTitle className="rp-modal-header">
        <div className="rp-modal-icon-box">
          <UserPlus className="text-blue-600" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h2 className="rp-modal-title">Cadastrar paciente</h2>
          <p className="rp-modal-subtitle">
            Comece apenas com nome e contato — o resto pode ser preenchido
            posteriormente.
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
            disabled={isSubmitting}
            onClick={isLastStep ? handleSubmit(submit) : handleNext}
          >
            {renderButtonContent()}
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  )
}
