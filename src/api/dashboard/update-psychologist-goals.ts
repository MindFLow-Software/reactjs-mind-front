import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type {
  IPsychologistGoalSettings,
  IUpdatePsychologistGoalsBody,
} from '@/types/dashboard'

export async function updatePsychologistGoals(
  body: IUpdatePsychologistGoalsBody,
): Promise<IMutationResult<IPsychologistGoalSettings>> {
  const response = await api.put('/dashboard/psychologist/goals', body)

  return { data: response.data, message: response.apiMessage ?? null }
}
