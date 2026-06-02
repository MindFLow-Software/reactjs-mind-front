export type UserType = 'PATIENT' | 'PSYCHOLOGIST' | 'ADMIN' | 'DEV' | 'CLINIC'

export interface Iuser {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phoneNumber: string | null
  profileImageUrl: string | null
  type: UserType
  cpf: string | null
  dateOfBirth: Date | null
  addressId: string | null
  createdAt: Date
  updatedAt: Date
}
