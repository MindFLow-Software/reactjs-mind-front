import { z } from 'zod'

export const updateGoalsSchema = z.object({
  monthlySessionsTarget: z.coerce.number().int().min(0),
  monthlyHoursTarget: z.coerce.number().int().min(0),
  activePatientsTarget: z.coerce.number().int().min(0),
})

export type UpdateGoalsFormData = z.infer<typeof updateGoalsSchema>
