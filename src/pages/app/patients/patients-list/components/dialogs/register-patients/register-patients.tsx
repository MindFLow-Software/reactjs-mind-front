import '../patient-form-fields.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { UserPlus } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { useFormSteps } from '@/hooks/use-form-steps'
import { useFileSelection } from '@/hooks/use-file-selection'
import {
  createPatientSchema,
  type CreatePatientFormData,
} from '@/validators/patients/form/create-patient-schema'

import { PatientFormModal } from '../patient-form-modal/patient-form-modal'
import { UploadZone } from './components/upload-zone/upload-zone'
import { StepBasicData } from './components/step-basic-data/step-basic-data'
import { StepContactAddress } from './components/step-contact-address/step-contact-address'
import { useCreatePatient } from './hooks/use-create-patient'
import { useStepErrorRedirect } from './hooks/use-step-error-redirect'
import { STEPS, MAX_DOC_FILES, MAX_DOC_SIZE } from './constants'

export function RegisterPatients() {
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

  const { step, handleNext, handleBack, goToStep, isFirstStep, isLastStep } =
    useFormSteps({ stepsLength: STEPS.length })

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

  const steps = {
    current: step,
    isFirstStep,
    isLastStep,
    handleNext,
    handleBack,
    goToStep,
  }

  function renderStepContent() {
    switch (step) {
      case 1:
        return <StepBasicData onAvatarSelect={setAvatarFile} patient={null} />
      case 2:
        return <StepContactAddress />
      case 3:
        return (
          <UploadZone
            selectedFiles={files}
            onFilesChange={addFiles}
            onRemoveFile={removeFile}
          />
        )
      default:
        return null
    }
  }

  return (
    <PatientFormModal>
      <PatientFormModal.Header
        icon={UserPlus}
        title="Cadastrar paciente"
        subtitle="Comece apenas com nome e contato — o resto pode ser preenchido posteriormente."
      />

      <PatientFormModal.Stepper steps={steps} />

      <Form {...methods}>
        <PatientFormModal.Body>{renderStepContent()}</PatientFormModal.Body>

        <PatientFormModal.Footer
          steps={steps}
          submit={{
            label: 'Cadastrar paciente',
            isSubmitting,
            onSubmit: handleSubmit(submit),
          }}
        />
      </Form>
    </PatientFormModal>
  )
}
