import { z } from 'zod'

export const markPopupAsViewedSchema = z.object({
  action: z.string().optional(),
})

export type MarkPopupAsViewedData = z.infer<typeof markPopupAsViewedSchema>
