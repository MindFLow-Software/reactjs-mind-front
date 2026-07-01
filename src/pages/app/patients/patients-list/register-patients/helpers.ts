import { Gender } from '@/types/enums'
import type { IPatientProfile } from '@/types/patient-profile'
import { formatCPF } from '@/utils/formatCPF'
import { formatPhone } from '@/utils/formatPhone'
import type { PatientFormData } from '@/validators/patients'

export function buildPatientDefaults(
  patient: IPatientProfile | null,
): PatientFormData {
  return {
    firstName: patient?.firstName ?? '',
    lastName: patient?.lastName ?? '',
    phoneNumber: patient?.phoneNumber ? formatPhone(patient.phoneNumber) : '',
    email: patient?.email ?? '',
    cpf: patient?.cpf ? formatCPF(patient.cpf) : '',
    gender: patient?.gender ?? Gender.OTHER,
    dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : null,
    profileImageUrl: patient?.profileImageUrl ?? undefined,
  }
}
