import './delete-patient-dialog.css'
import { PatientStatusDialog } from '@/components/patient-status-dialog'

type IDeletePatientDialog = {
  fullName: string
  action: {
    onClose: () => void
    onConfirm: () => Promise<void>
    isPending: boolean
  }
}

export function DeletePatientDialog({
  fullName,
  action,
}: IDeletePatientDialog) {
  return (
    <PatientStatusDialog mode="archive" fullName={fullName} action={action} />
  )
}
