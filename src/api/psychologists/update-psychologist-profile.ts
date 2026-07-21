import { api } from '@/lib/axios'
import type { ITypedFormData } from '@/hooks/use-form-data'
import type { UpdatePsychologistData } from '@/validators/psychologists/form/update-psychologist-schema'
import type { IMutationResult } from '@/types/shared/mutation-result'

/**
 * Atualiza os dados do perfil do psicólogo logado.
 * Usa PATCH multipart pois a imagem de perfil vai junto com os demais campos.
 */
export async function updatePsychologistProfile(
  formData: ITypedFormData<UpdatePsychologistData>,
): Promise<IMutationResult<void>> {
  const response = await api.patch('/psychologist/profile', formData)

  return { data: response.data, message: response.apiMessage ?? null }
}
