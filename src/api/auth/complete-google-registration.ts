import { api } from "@/lib/axios"
import type { Gender } from "@/types/enum-gender"
import type { Expertise } from "@/types/expertise"

export interface CompleteGoogleRegistrationBody {
  token: string
  crp: string
  expertise: Expertise
  gender: Gender
}

export async function completeGoogleRegistration(data: CompleteGoogleRegistrationBody) {
  const response = await api.post("/auth/complete-registration", data)
  return response.data
}
