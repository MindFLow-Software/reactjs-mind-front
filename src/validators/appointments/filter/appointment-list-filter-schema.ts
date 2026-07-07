import { z } from 'zod'

export const appointmentListFilterSchema = z.object({
  pageIndex: z.coerce.number().int().min(0).default(0),
  perPage: z.coerce.number().int().min(1).default(10),
  orderBy: z.enum(['asc', 'desc']).default('asc'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  patientName: z.string().optional(),
})

export type AppointmentListFilterQuery = z.infer<
  typeof appointmentListFilterSchema
>
