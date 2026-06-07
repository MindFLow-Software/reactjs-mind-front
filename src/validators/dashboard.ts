import { z } from 'zod'

export const dashboardQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// startDate and endDate are required — omitting either causes Invalid Date on the backend
export const adminPatientsChartQuerySchema = z.object({
  startDate: z.string().min(1, 'Data inicial obrigatória'),
  endDate: z.string().min(1, 'Data final obrigatória'),
})

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>
export type AdminPatientsChartQuery = z.infer<
  typeof adminPatientsChartQuerySchema
>
