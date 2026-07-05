import type { Gender, PlatformRole } from '@/types/enums'

export type { PlatformRole } from '@/types/enums'

export interface IUser {
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
