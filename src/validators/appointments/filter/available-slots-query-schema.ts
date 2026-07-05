import { z } from 'zod'

export const availableSlotsQuerySchema = z.object({
  psychologistPracticeContextId: z.string().uuid('ID do contexto inválido'),
  startDate: z.string(),
  endDate: z.string(),
})

export type AvailableSlotsQuery = z.infer<typeof availableSlotsQuerySchema>
