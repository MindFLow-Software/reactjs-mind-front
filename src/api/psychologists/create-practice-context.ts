import { api } from '@/lib/axios'
import type { ICreatePracticeContextBody } from '@/types/psychologist/create-practice-context-body'
import type { IPsychologistPracticeContext } from '@/types/psychologist/practice-context'
import type { IMutationResult } from '@/types/shared/mutation-result'

export async function createPracticeContext(
  body: ICreatePracticeContextBody,
): Promise<IMutationResult<IPsychologistPracticeContext>> {
  const response = await api.post<IPsychologistPracticeContext>(
    '/psychologist/practice-context',
    body,
  )
  return { data: response.data, message: response.apiMessage ?? null }
}
