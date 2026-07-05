import { z } from 'zod'

export const fetchPsychologistsQuerySchema = z.object({
  pageIndex: z.coerce.number().int().min(0).default(0),
  perPage: z.coerce.number().int().min(1).default(10),
})

export type FetchPsychologistsQuery = z.infer<
  typeof fetchPsychologistsQuerySchema
>
