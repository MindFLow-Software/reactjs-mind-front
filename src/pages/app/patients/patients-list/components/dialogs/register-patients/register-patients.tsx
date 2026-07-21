import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UserPlus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import {
  StepperDialog,
  type IStepperNav,
} from '@/components/stepper-dialog/stepper-dialog'
import { useFormSteps } from '@/hooks/use-form-steps'
import { useFileSelection } from '@/hooks/use-file-selection'
import {
  createPatientSchema,
  type CreatePatientFormData,
} from '@/validators/patients/form/create-patient-schema'

import { FileUploadField } from '@/components/form-fields/file-upload-field/file-upload-field'
import { StepBasicData } from './components/step-basic-data/step-basic-data'
import { StepContactAddress } from './components/step-contact-address/step-contact-address'
import { useCreatePatient } from './hooks/use-create-patient'
import { useStepErrorRedirect } from './hooks/use-step-error-redirect'
import { STEPS, MAX_DOC_FILES, MAX_DOC_SIZE } from './constants'
import { buildPatientUpdateDefaults } from '../create-and-edit-patient-modal.helpers'

import '../patient-form-fields.css'

type IRegisterPatients = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterPatients({ open, onOpenChange }: IRegisterPatients) {
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

  const { step, handleNext, handleBack, goToStep } = useFormSteps({
    stepsLength: STEPS.length,
  })

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

  useStepErrorRedirect({ errors, schema: createPatientSchema, goToStep })

  const nav: IStepperNav = {
    current: step,
    total: STEPS.length,
    onNext: handleNext,
    onBack: handleBack,
    onGoTo: goToStep,
  }

  function renderStepContent() {
    switch (step) {
      case 1:
        return <StepBasicData onAvatarSelect={setAvatarFile} patient={null} />
      case 2:
        return <StepContactAddress />
      case 3:
        return (
          <FileUploadField
            upload={{ files, onAddFiles: addFiles, onRemoveFile: removeFile }}
            accept={{ 'application/pdf': [], 'image/*': [] }}
            description={`PDFs ou imagens · máximo ${MAX_DOC_FILES} arquivos · até 3 MB cada`}
          />
        )
      default:
        return null
    }
  }

  useEffect(() => {
    reset(buildPatientUpdateDefaults())
  }, [reset])

  return (
    <StepperDialog open={open} onOpenChange={onOpenChange}>
      <StepperDialog.Header
        icon={UserPlus}
        title="Cadastrar paciente"
        subtitle="Comece apenas com nome e contato — o resto pode ser preenchido posteriormente."
      />

      <StepperDialog.Steps steps={nav} definitions={STEPS} />

      <Form {...methods}>
        <StepperDialog.Body>{renderStepContent()}</StepperDialog.Body>

        <StepperDialog.Footer
          steps={nav}
          submit={{
            label: 'Cadastrar paciente',
            isSubmitting,
            onSubmit: handleSubmit(submit),
          }}
        />
      </Form>
    </StepperDialog>
  )
}
