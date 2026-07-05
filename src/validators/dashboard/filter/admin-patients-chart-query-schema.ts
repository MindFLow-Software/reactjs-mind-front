import { z } from 'zod'

// startDate and endDate are required — omitting either causes Invalid Date on the backend
export const adminPatientsChartQuerySchema = z.object({
  startDate: z.string().min(1, 'Data inicial obrigatória'),
  endDate: z.string().min(1, 'Data final obrigatória'),
})

export type AdminPatientsChartQuery = z.infer<
  typeof adminPatientsChartQuerySchema
>
