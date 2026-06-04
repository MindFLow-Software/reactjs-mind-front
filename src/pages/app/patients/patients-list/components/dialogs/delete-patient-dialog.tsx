import { PatientStatusDialog } from '@/components/patient-status-dialog'

interface DeletePatientDialogProps {
  fullName: string
  onClose: () => void
  onConfirm: () => Promise<void>
  isPending: boolean
}

export function DeletePatientDialog({
  fullName,
  onClose,
  onConfirm,
  isPending,
}: DeletePatientDialogProps) {
  return (
    <PatientStatusDialog
      mode="archive"
      fullName={fullName}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
    />
  )
}
