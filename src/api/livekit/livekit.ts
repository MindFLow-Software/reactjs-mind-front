import { api } from '@/lib/axios'

export interface LivekitTokenResponse {
  token: string
}

export async function fetchLivekitToken(
  identity: string,
  room: string,
): Promise<string> {
  const response = await api.get<LivekitTokenResponse>('/livekit/token', {
    params: { identity, room },
  })

  return response.data.token
}
