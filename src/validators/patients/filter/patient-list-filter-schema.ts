import { z } from 'zod'

export const patientListFilterSchema = z.object({
  pageIndex: z.coerce.number().int().min(0).default(0),
  perPage: z.coerce.number().int().min(1).default(10),
  filter: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'REJECTED', 'BLOCKED']).optional(),
  gender: z.enum(['FEMININE', 'MASCULINE', 'OTHER']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  sessionVolume: z.string().optional(),
})

export type PatientListFilterQuery = z.infer<typeof patientListFilterSchema>
