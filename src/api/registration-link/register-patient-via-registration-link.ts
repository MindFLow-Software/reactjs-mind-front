import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/api'

import type { RegisterPatientViaRegistrationLinkData } from '@/validators/register-patient-via-registration-link/form/register-patient-via-registration-link-schema'

export async function registerPatientViaRegistrationLink(
  data: RegisterPatientViaRegistrationLinkData
): Promise<IMutationResult<void>> {
  const response = await api.post('/', data)
  return { data: response.data, message: response.apiMessage ?? null }
}
