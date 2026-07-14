import type { Gender, PlatformRole } from '@/types/shared/enums'

export type IUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string | null
  profileImageUrl: string | null
  dateOfBirth: string | null
  cpf: string | null
  gender: Gender
  isActive: boolean
  platformRole: PlatformRole
  createdAt: string
}
