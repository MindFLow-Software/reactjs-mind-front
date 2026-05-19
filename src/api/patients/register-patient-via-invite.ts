import { api } from '@/lib/axios'
import type {
  RegisterPatientViaInviteBody,
  RegisterPatientViaInviteResponse,
} from '@/types/patient'

export type {
  RegisterPatientViaInviteBody,
  RegisterPatientViaInviteResponse,
} from '@/types/patient'

export async function registerPatientViaInvite(
  hash: string,
  body: RegisterPatientViaInviteBody,
): Promise<RegisterPatientViaInviteResponse> {
  const response = await api.post<RegisterPatientViaInviteResponse>(
    `/invites/${hash}/register`,
    body,
  )
  return response.data
}
