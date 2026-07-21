import { api } from '@/lib/axios'
import type { ITypedFormData } from '@/hooks/use-form-data'
import type { CreatePsychologistProfileData } from '@/validators/psychologists/form/create-psychologist-profile-schema'
import type { IPsychologistProfile } from '@/types/psychologist/psychologist-profile'
import type { IMutationResult } from '@/types/shared/mutation-result'

export async function createPsychologistProfile(
  formData: ITypedFormData<CreatePsychologistProfileData>,
): Promise<IMutationResult<IPsychologistProfile>> {
  const response = await api.post<IPsychologistProfile>(
    '/psychologist/profile',
    formData,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
