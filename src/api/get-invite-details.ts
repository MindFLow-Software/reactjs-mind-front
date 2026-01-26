import { api } from "@/lib/axios"

interface GetInviteDetailsResponse {
  psychologistName: string
  psychologistId: string
  // Você pode retornar mais dados aqui, como a foto do psicólogo
}

export async function getInviteDetails(hash: string) {
  const response = await api.get<GetInviteDetailsResponse>(`/invites/${hash}/validate`)

  return response.data
}