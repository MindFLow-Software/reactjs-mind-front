import type { Gender } from '@/types/shared/enums'

export type IUpdatePatientBody = {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  dateOfBirth?: string
  cpf?: string
  gender?: Gender
  profileImageUrl?: string
  attachmentIds?: string[]
  zipCode?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city?: string | null
  state?: string | null
  modality?: string
  frequency?: string
  price?: string
  source?: string
  notes?: string
}
