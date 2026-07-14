import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'

export const translatedPatientProfileStatus: Record<
  PatientProfileStatus,
  string
> = {
  [PatientProfileStatus.ACTIVE]: 'Ativo',
  [PatientProfileStatus.INACTIVE]: 'Inativo',
  [PatientProfileStatus.ARCHIVED]: 'Arquivado',
}
