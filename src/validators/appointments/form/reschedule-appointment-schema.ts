import { z } from 'zod'

// z.string().datetime() requires full ISO 8601 with timezone — e.g. "2026-06-01T14:00:00.000Z"
export const rescheduleAppointmentSchema = z.object({
  newDate: z.string().datetime({
    message: 'Data inválida — use ISO 8601 com timezone (ex: ...Z)',
  }),
})

export type RescheduleAppointmentData = z.infer<
  typeof rescheduleAppointmentSchema
>
