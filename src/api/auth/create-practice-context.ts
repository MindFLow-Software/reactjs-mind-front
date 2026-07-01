import { api } from '@/lib/axios'
import type {
  CreatePracticeContextBody,
  IPsychologistPracticeContext,
} from '@/types/psychologist'

export async function createPracticeContext(
  body: CreatePracticeContextBody,
): Promise<IPsychologistPracticeContext> {
  const response = await api.post<IPsychologistPracticeContext>(
    '/psychologist/practice-context',
    body,
  )
  return response.data
}
