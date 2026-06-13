import { api } from '@/lib/axios'
import type { Gender } from '@/types/enum-gender'

export interface RegisterPsychologistBody {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  cpf: string
  dateOfBirth: Date | string
  gender: Gender
  profileImageUrl?: string
  crp?: string
}

export async function registerPsychologist(data: RegisterPsychologistBody) {
  const raw = {
    ...data,
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? toISODate(data.dateOfBirth)
        : data.dateOfBirth,
  }

  const payload = Object.fromEntries(
    Object.entries(raw).filter(
      ([, val]) => val !== '' && val !== null && val !== undefined,
    ),
  )

  const response = await api.post('/psychologist', payload)

  return response.data
}

function toISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
