import { z } from 'zod'

export const deleteAttachmentParamSchema = z.object({
  id: z.uuid('ID inválido'),
})

export type DeleteAttachmentParam = z.infer<typeof deleteAttachmentParamSchema>
