import { z } from 'zod'

export const fetchAttachmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  filter: z.string().optional(),
  patientId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type FetchAttachmentsQuery = z.infer<typeof fetchAttachmentsQuerySchema>
