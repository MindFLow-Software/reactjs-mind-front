import { api } from '@/lib/axios'

interface IgenerateRegistrationLinkResponse {
  qrCodeLink: string
  hash: string
}

export async function generateRegistrationLink() {
  const response = await api.post<IgenerateRegistrationLinkResponse>('/invites')

  return response.data
}
