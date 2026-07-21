import { Gender } from '@/types/shared/enums'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'
import { Mask } from '@/utils/mask'
import { Time } from '@/utils/time'
import type { UpdatePatientFormData } from '@/validators/patients/form/update-patient-schema'

export function buildPatientUpdateDefaults(
  patient?: IPatientProfile,
): UpdatePatientFormData {
  return {
    firstName: patient?.firstName ?? '',
    lastName: patient?.lastName ?? '',
    phoneNumber: patient?.phoneNumber ? Mask.phone(patient.phoneNumber) : '',
    email: patient?.email ?? undefined,
    cpf: patient?.cpf ? Mask.cpf(patient.cpf) : undefined,
    gender: patient?.gender ?? Gender.OTHER,
    dateOfBirth: patient?.dateOfBirth ? Time.parse(patient.dateOfBirth) : null,
    attachmentIds: [],
  }
}
