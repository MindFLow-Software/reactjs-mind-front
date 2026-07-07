import { z } from 'zod'

// Both dates are required — omitting either causes 400 from the backend
export const patientStatsQuerySchema = z.object({
  startDate: z.string().min(1, 'Data inicial obrigatória'),
  endDate: z.string().min(1, 'Data final obrigatória'),
})

export type PatientStatsQuery = z.infer<typeof patientStatsQuerySchema>
