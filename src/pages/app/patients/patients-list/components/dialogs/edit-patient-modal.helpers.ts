import { Gender } from '@/types/shared/enums'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'
import { formatCPF } from '@/utils/formatCPF'
import { formatPhone } from '@/utils/formatPhone'
import type { UpdatePatientFormData } from '@/validators/patients/form/update-patient-schema'

export function buildPatientUpdateDefaults(
  patient: IPatientProfile,
): UpdatePatientFormData {
  return {
    firstName: patient.firstName,
    lastName: patient.lastName,
    phoneNumber: patient.phoneNumber ? formatPhone(patient.phoneNumber) : '',
    email: patient.email ?? '',
    cpf: patient.cpf ? formatCPF(patient.cpf) : '',
    gender: patient.gender ?? Gender.OTHER,
    dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : null,
    profileImageUrl: patient.profileImageUrl ?? undefined,
  }
}
