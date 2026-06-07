import { z } from 'zod'

export const ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
] as const

export const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024

export const ACCEPTED_MIME_LABEL = 'PDFs, imagens ou áudios'

export const uploadFileSchema = z
  .custom<File>()
  .refine(
    (f) =>
      ACCEPTED_MIME_TYPES.includes(
        f.type as (typeof ACCEPTED_MIME_TYPES)[number],
      ),
    { message: 'Tipo de arquivo não suportado. Envie PDF ou imagem.' },
  )
  .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, {
    message: 'Arquivo excede 3 MB.',
  })

export type UploadFileInput = z.infer<typeof uploadFileSchema>

export const uploadFormSchema = z.object({
  patientId: z.string().min(1, 'Selecione um paciente'),
  files: z.array(uploadFileSchema).min(1, 'Selecione pelo menos um arquivo'),
})

export type UploadFormData = z.infer<typeof uploadFormSchema>

export const fetchAttachmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  filter: z.string().optional(),
  patientId: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type FetchAttachmentsQuery = z.infer<typeof fetchAttachmentsQuerySchema>

export const deleteAttachmentParamSchema = z.object({
  id: z.uuid('ID inválido'),
})

export type DeleteAttachmentParam = z.infer<typeof deleteAttachmentParamSchema>
