import { api } from '@/lib/axios'
import type {
  CreatePracticeContextBody,
  IPsychologistPracticeContext,
} from '@/types/psychologist'
import type { IMutationResult } from '@/types/api'

export async function createPracticeContext(
  body: CreatePracticeContextBody,
): Promise<IMutationResult<IPsychologistPracticeContext>> {
  const response = await api.post<IPsychologistPracticeContext>(
    '/psychologist/practice-context',
    body,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
