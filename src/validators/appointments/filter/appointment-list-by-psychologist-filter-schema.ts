import { z } from 'zod'

// Unlike appointmentListFilterSchema, this endpoint returns `meta` with pagination.
export const appointmentListByPsychologistFilterSchema = z.object({
  pageIndex: z.coerce.number().int().min(0).default(0),
  perPage: z.coerce.number().int().min(1).default(10),
  orderBy: z.enum(['asc', 'desc']).default('asc'),
})

export type AppointmentListByPsychologistFilterQuery = z.infer<
  typeof appointmentListByPsychologistFilterSchema
>
