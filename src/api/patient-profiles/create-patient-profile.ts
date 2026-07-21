import { api } from '@/lib/axios'
import { normalizeFormDataDigits } from '@/lib/normalize-form-data-digits'
import type { ITypedFormData } from '@/hooks/use-form-data'
import type { CreatePatientFormData } from '@/validators/patients/form/create-patient-schema'
import type { ICreatePatientResponse } from '@/types/patient/create-patient-response'

export async function createPatientProfile(
  formData: ITypedFormData<CreatePatientFormData>,
): Promise<ICreatePatientResponse> {
  normalizeFormDataDigits(formData, ['cpf', 'phoneNumber'])

  const response = await api.post<ICreatePatientResponse>(
    '/patient-profiles',
    formData,
  )
  return response.data
}
