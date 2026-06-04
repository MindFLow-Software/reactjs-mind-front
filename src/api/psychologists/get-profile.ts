import { api } from '@/lib/axios'
import type { Gender } from '@/types/enum-gender'
import type { Expertise, PsychologistRole } from '@/types/expertise'

export interface GetProfileResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  cpf: string
  dateOfBirth: string
  role: PsychologistRole
  gender: Gender
  expertise: Expertise
  isActive: boolean
  profileImageUrl: string | null
  bannerImageUrl: string | null
  crp: string | null
  createdAt: string
  paymentId: string | null
  planExpiresAt: Date | null
  status: string
  type: string
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get('/me')

  const { authenticatedUser: raw }: { authenticatedUser: GetProfileResponse } =
    response.data

  const user: GetProfileResponse = {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phoneNumber: raw.phoneNumber,
    cpf: raw.cpf,
    dateOfBirth: raw.dateOfBirth,
    role: raw.role,
    gender: raw.gender,
    expertise: raw.expertise,
    isActive: raw.isActive,
    crp: raw.crp,
    profileImageUrl: raw.profileImageUrl ?? null,
    bannerImageUrl: raw.bannerImageUrl ?? null,
    createdAt: raw.createdAt,
    paymentId: raw?.paymentId ?? null,
    planExpiresAt: raw?.planExpiresAt ? new Date(raw.planExpiresAt) : null,
    status: raw.status,
    type: raw.type,
  }

  localStorage.setItem('user', JSON.stringify(user))

  return user
}
