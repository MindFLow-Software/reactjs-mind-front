import { api } from "@/lib/axios"
import { format } from "date-fns"
import type { Gender } from "@/types/enum-gender"

export interface RegisterPatientsBody {
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  profileImageUrl?: string
  dateOfBirth?: Date | string | null
  cpf?: string
  gender?: Gender
  attachmentIds?: string[]
}

export async function registerPatients(data: RegisterPatientsBody) {
  const formattedData = {
    ...data,
    cpf: data.cpf || undefined,
    phoneNumber: data.phoneNumber || undefined,
    
    dateOfBirth:
      data.dateOfBirth instanceof Date
        ? format(data.dateOfBirth, "yyyy-MM-dd")
        : data.dateOfBirth || undefined,
  }

  const response = await api.post("/patients", formattedData)
  return response.data
}