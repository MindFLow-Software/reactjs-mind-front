import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'
import type { IPsychologistGoalSettings } from '@/types/dashboard/psychologist-goal-settings'
import type { IUpdatePsychologistGoalsBody } from '@/types/dashboard/update-psychologist-goals-body'

export async function updatePsychologistGoals(
  body: IUpdatePsychologistGoalsBody,
): Promise<IMutationResult<IPsychologistGoalSettings>> {
  const response = await api.put('/dashboard/psychologist/goals', body)

  return { data: response.data, message: response.apiMessage ?? null }
}
