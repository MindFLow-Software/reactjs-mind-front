import type { Gender } from '@/types/shared/enums'

export type ICreatePatientBody = {
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  profileImageUrl?: string
  dateOfBirth?: string
  cpf?: string
  gender?: Gender
  zipCode?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  modality?: string
  frequency?: string
  price?: string
  source?: string
  notes?: string
}
