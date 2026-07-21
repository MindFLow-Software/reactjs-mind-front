import { api } from '@/lib/axios'
import { normalizeFormDataDigits } from '@/lib/normalize-form-data-digits'
import type { ITypedFormData } from '@/hooks/use-form-data'
import type { UpdatePatientFormData } from '@/validators/patients/form/update-patient-schema'
import type { IPatientProfile } from '@/types/patient-profile/patient-profile'
import type { IMutationResult } from '@/types/shared/mutation-result'

type IUpdatePatientProfileParams = {
  id: string
  formData: ITypedFormData<UpdatePatientFormData>
}

export async function updatePatientProfileById({
  id,
  formData,
}: IUpdatePatientProfileParams): Promise<IMutationResult<IPatientProfile>> {
  normalizeFormDataDigits(formData, ['cpf', 'phoneNumber'])

  const response = await api.put<IPatientProfile>(
    `/patient-profiles/${id}`,
    formData,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
