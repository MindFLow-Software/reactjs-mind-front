import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { UserPen } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import {
  StepperDialog,
  type IStepperNav,
} from '@/components/stepper-dialog/stepper-dialog'
import { usePatient } from '@/hooks/use-patient'
import { useFormSteps } from '@/hooks/use-form-steps'
import { useFileSelection } from '@/hooks/use-file-selection'
import {
  updatePatientSchema,
  type UpdatePatientFormData,
} from '@/validators/patients/form/update-patient-schema'

import { FileUploadField } from '@/components/form-fields/file-upload-field/file-upload-field'
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

import '../patient-form-fields.css'

type IEditPatientModal = {
  patientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditPatientModal({
  patientId,
  open,
  onOpenChange,
}: IEditPatientModal) {
  const { patient } = usePatient(patientId)

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

  const { step, handleNext, handleBack, goToStep } = useFormSteps({
    stepsLength: STEPS.length,
  })

  const { submit, isSubmitting } = useUpdatePatient({
    patientId,
    files,
    onSuccess: () => {
      reset()
      goToStep(1)
      clearFiles()
    },
  })

  useStepErrorRedirect({ errors, schema: updatePatientSchema, goToStep })

  const nav: IStepperNav = {
    current: step,
    total: STEPS.length,
    onNext: handleNext,
    onBack: handleBack,
    onGoTo: goToStep,
  }

  const subtitle = patient
    ? `Atualize os dados de ${patient.firstName}. Mudanças salvam automaticamente ao avançar.`
    : 'Carregando dados do paciente…'

  function renderStepContent() {
    switch (step) {
      case 1:
        return <StepBasicData patient={patient} />
      case 2:
        return <StepContactAddress />
      case 3:
        return (
          <div className="flex flex-col gap-5">
            <AttachmentsList patientId={patient?.id ?? null} />
            <FileUploadField
              upload={{ files, onAddFiles: addFiles, onRemoveFile: removeFile }}
              accept={{ 'application/pdf': [], 'image/*': [] }}
              description={`PDFs ou imagens · máximo ${MAX_DOC_FILES} arquivos · até 3 MB cada`}
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
    <StepperDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-2">
        <StepperDialog.Header
          icon={UserPen}
          title="Editar paciente"
          subtitle={subtitle}
        />
        <StepperDialog.Steps steps={nav} definitions={STEPS} />
      </div>

      <Form {...methods}>
        <StepperDialog.Body>{renderStepContent()}</StepperDialog.Body>

        <StepperDialog.Footer
          steps={nav}
          disabled={isPatientLoading}
          submit={{
            isSubmitting,
            label: 'Salvar alterações',
            onSubmit: handleSubmit(submit),
          }}
        />
      </Form>
    </StepperDialog>
  )
}
