import { api } from "@/lib/axios"

// Tipagem baseada no que o seu Backend espera (Zod Schema)
export interface UpdatePsychologistBody {
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  crp?: string
  // Expertise segue o Enum definido no backend
  expertise?: 
    | 'OTHER' 
    | 'SOCIAL' 
    | 'INFANT' 
    | 'CLINICAL' 
    | 'JURIDICAL' 
    | 'EDUCATIONAL' 
    | 'ORGANIZATIONAL' 
    | 'PSYCHOTHERAPIST' 
    | 'NEUROPSYCHOLOGY'
  profileImageUrl?: string | null
}

/**
 * Atualiza os dados do perfil do psicólogo logado.
 * * @param body - Dados parciais para atualização
 */
export async function updatePsychologist(body: UpdatePsychologistBody) {
  // Utilizamos PATCH pois o backend está configurado com @Patch('/profile')
  // e queremos uma atualização parcial (apenas o que foi enviado).
  const response = await api.patch('/psychologist/profile', body)
  
  return response.data
}