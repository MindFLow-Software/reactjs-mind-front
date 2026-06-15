export type PlatformRole = 'USER' | 'ADMIN' | 'SUPPORT'

export interface Iuser {
  id: string
  firstName: string
  lastName: string
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  profileImageUrl: string | null
  dateOfBirth: string | null
  isActive: boolean
  gender: string
  platformRole: PlatformRole
  createdAt: string
}
