import { api } from '@/lib/axios'
import type { Gender } from '@/types/enum-gender'
import type { Expertise, PsychologistRole } from '@/types/expertise'

interface GetProfileResponse {
  firstName: string
  lastName: string
  phoneNumber: string
  cpf: string
  dateOfBirth: Date | string
  role: PsychologistRole
  gender: Gender
  expertise: Expertise
  isActive?: boolean
  email?: string
  password?: string
  profileImageUrl?: string
  crp?: string
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>('/psychologists/me')
  return response.data
}
