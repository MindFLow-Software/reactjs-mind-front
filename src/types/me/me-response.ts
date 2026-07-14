import type { Gender, PlatformRole } from '@/types/shared/enums'
import type {
  IPsychologistProfile,
  IPsychologistPracticeContext,
} from '@/types/psychologist'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'
import type { IClinicMemberContext } from '@/types/me/clinic-member-context'

export type IMeResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  cpf: string | null
  phoneNumber: string | null
  gender: Gender
  dateOfBirth: string | null
  profileImageUrl: string | null
  isActive: boolean
  platformRole: PlatformRole
  createdAt: string
  psychologistProfile: IPsychologistProfile | null
  practiceContexts: IPsychologistPracticeContext[]
  patientProfiles: IPatientProfile[]
  clinicMemberContexts: IClinicMemberContext[]
}
