import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/api'
import type { Expertise, Honorific, Languages } from '@/types/enums'

export interface UpdatePsychologistBody {
  crp?: string
  expertise?: Expertise
  honorific?: Honorific
  languages?: Languages[]
  professionalBio?: string
  professionalName?: string
  profileImageUrl?: string
}

/**
 * Atualiza os dados do perfil do psicólogo logado.
 * * @param body - Dados parciais para atualização
 */
export async function updatePsychologist(
  body: UpdatePsychologistBody,
): Promise<IMutationResult<void>> {
  // Utilizamos PATCH pois o backend está configurado com @Patch('/profile')
  // e queremos uma atualização parcial (apenas o que foi enviado).
  const response = await api.patch('/psychologist/profile', body)

  return { data: response.data, message: response.apiMessage ?? null }
}
