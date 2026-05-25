import { z } from "zod"

export const ACCEPTED_MIME_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
] as const

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const ACCEPTED_MIME_LABEL = "PDFs, imagens ou áudios"

export const uploadFileSchema = z
    .custom<File>()
    .refine(
        (f) => ACCEPTED_MIME_TYPES.includes(f.type as (typeof ACCEPTED_MIME_TYPES)[number]),
        { message: "Tipo de arquivo não suportado. Envie PDF ou imagem." },
    )
    .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, {
        message: "Arquivo excede 5 MB.",
    })

export type UploadFileInput = z.infer<typeof uploadFileSchema>

export const uploadFormSchema = z.object({
    patientId: z.string().min(1, "Selecione um paciente"),
    files:     z.array(uploadFileSchema).min(1, "Selecione pelo menos um arquivo"),
})

export type UploadFormData = z.infer<typeof uploadFormSchema>
