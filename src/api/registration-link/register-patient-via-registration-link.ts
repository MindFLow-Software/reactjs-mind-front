import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/api'

import type { RegisterPatientViaRegistrationLinkData } from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

export async function registerPatientViaRegistrationLink(
  hash: string | undefined,
  data: RegisterPatientViaRegistrationLinkData
): Promise<IMutationResult<void>> {
  const response = await api.post(`/patient-profiles/registration-links/${hash}/register`, data)
  return { data: response.data, message: response.apiMessage ?? null }
}
