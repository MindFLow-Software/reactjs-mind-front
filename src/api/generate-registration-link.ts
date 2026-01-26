import { api } from "@/lib/axios"

interface GenerateRegistrationLinkResponse {
  qrCodeLink: string
  hash: string
}

export async function generateRegistrationLink() {
  const response = await api.post<GenerateRegistrationLinkResponse>("/invites")

  return response.data
}