import { api } from '@/lib/axios'
import type {
  CreatePracticeContextBody,
  PsychologistPracticeContext,
} from '@/types/psychologist'

export async function createPracticeContext(
  body: CreatePracticeContextBody,
): Promise<PsychologistPracticeContext> {
  const response = await api.post<PsychologistPracticeContext>(
    '/psychologist/practice-context',
    body,
  )
  return response.data
}
