import { Gender } from '@/types/enums'
import type { IPatientProfile } from '@/types/patient-profile'
import { formatCPF } from '@/utils/formatCPF'
import { formatPhone } from '@/utils/formatPhone'
import type { CreatePatientFormData } from '@/validators/patients/form/create-patient-schema'

export function buildPatientDefaults(
  patient: IPatientProfile | null,
): CreatePatientFormData {
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
