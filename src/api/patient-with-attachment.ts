import { api } from "@/lib/axios"

// Interface que espelha exatamente o que o PatientPresenter envia
export interface PatientWithAttachment {
  id: string
  name: string
  firstName: string
  lastName: string
  profileImageUrl: string | null
}

/**
 * Busca apenas os pacientes que possuem documentos vinculados.
 * Rota segura: /patients/filter/with-attachments
 */
export async function getPatientsWithAttachments(): Promise<PatientWithAttachment[]> {
  const response = await api.get<{ patients: PatientWithAttachment[] }>(
    '/patients/filter/with-attachments'
  )
  
  return response.data.patients
}