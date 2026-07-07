import { z } from 'zod'

export const updateAppointmentSchema = z.object({
  diagnosis: z.string().optional(),
  content: z.string().optional(),
})

export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>
