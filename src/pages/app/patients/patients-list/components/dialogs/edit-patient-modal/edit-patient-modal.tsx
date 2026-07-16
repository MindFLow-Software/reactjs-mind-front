import '../patient-form-fields.css'
import { useEffect, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { UserPen } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { usePatient } from '@/hooks/use-patient'
import { useFormSteps } from '@/hooks/use-form-steps'
import { useFileSelection } from '@/hooks/use-file-selection'
import {
  updatePatientSchema,
  type UpdatePatientFormData,
} from '@/validators/patients/form/update-patient-schema'

import { PatientFormModal } from '../patient-form-modal/patient-form-modal'
import { UploadZone } from '../register-patients/components/upload-zone/upload-zone'
import { StepBasicData } from '../register-patients/components/step-basic-data/step-basic-data'
import { AttachmentsList } from '../register-patients/components/attachments-list/attachments-list'
import { StepContactAddress } from '../register-patients/components/step-contact-address/step-contact-address'
import { useUpdatePatient } from '../register-patients/hooks/use-update-patient'
import { useStepErrorRedirect } from '../register-patients/hooks/use-step-error-redirect'
import {
  MAX_DOC_FILES,
  MAX_DOC_SIZE,
  STEPS,
} from '../register-patients/constants'
import { buildPatientUpdateDefaults } from '../create-and-edit-patient-modal.helpers'

type IEditPatientModal = {
  patientId: string
}

export function EditPatientModal({ patientId }: IEditPatientModal) {
  const { patient } = usePatient(patientId)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const { files, addFiles, removeFile, clearFiles } = useFileSelection({
    maxFiles: MAX_DOC_FILES,
    maxSizeBytes: MAX_DOC_SIZE,
  })

  const methods = useForm<UpdatePatientFormData>({
    resolver: zodResolver(
      updatePatientSchema,
    ) as Resolver<UpdatePatientFormData>,
    defaultValues: buildPatientUpdateDefaults(),
  })

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods

  const { step, handleNext, handleBack, goToStep, isFirstStep, isLastStep } =
    useFormSteps({ stepsLength: STEPS.length })

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

  useStepErrorRedirect({ errors, schema: updatePatientSchema, goToStep })

  const steps = {
    current: step,
    isFirstStep,
    isLastStep,
    handleNext,
    handleBack,
    goToStep,
  }

  const subtitle = patient
    ? `Atualize os dados de ${patient.firstName}. Mudanças salvam automaticamente ao avançar.`
    : 'Carregando dados do paciente…'

  function renderStepContent() {
    switch (step) {
      case 1:
        return (
          <StepBasicData onAvatarSelect={setAvatarFile} patient={patient} />
        )
      case 2:
        return <StepContactAddress />
      case 3:
        return (
          <div className="flex flex-col gap-5">
            <AttachmentsList patientId={patient?.id ?? null} />
            <UploadZone
              selectedFiles={files}
              onFilesChange={addFiles}
              onRemoveFile={removeFile}
            />
          </div>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    if (!patient) return

    reset(buildPatientUpdateDefaults(patient))
  }, [patient, reset])

  const isPatientLoading = !patient

  return (
    <PatientFormModal>
      <PatientFormModal.Header
        icon={UserPen}
        title="Editar paciente"
        subtitle={subtitle}
      />

      <PatientFormModal.Stepper steps={steps} />

      <Form {...methods}>
        <PatientFormModal.Body>{renderStepContent()}</PatientFormModal.Body>

        <PatientFormModal.Footer
          steps={steps}
          disabled={isPatientLoading}
          submit={{
            isSubmitting,
            label: 'Salvar alterações',
            onSubmit: handleSubmit(submit),
          }}
        />
      </Form>
    </PatientFormModal>
  )
}
