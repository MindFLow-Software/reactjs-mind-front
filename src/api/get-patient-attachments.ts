import { api } from "@/lib/axios"

export interface Attachment {
  id: string
  filename: string
  url: string
  type: string
  size: number
  uploadedAt: string
}

export async function getPatientAttachments(patientId: string): Promise<Attachment[]> {
  const response = await api.get<{ attachments: any[] }>(`/attachments/patient/${patientId}`)
  
  // Normalizamos cada anexo para garantir que o Frontend entenda os campos
  return response.data.attachments.map((attachment) => {
    // Se o NestJS enviar dentro de .props (comum no DDD), pegamos de lá
    const raw = attachment.props || attachment

    return {
      id: raw.id,
      // Mapeia as variações comuns (camelCase, snake_case e nomes do Prisma)
      filename: raw.filename || raw.fileName || raw.title || "Documento sem nome",
      url: raw.url || raw.fileUrl || raw.file_url || "",
      type: raw.type || raw.fileType || raw.file_type || "unknown",
      size: raw.size || raw.fileSize || raw.file_size || 0,
      uploadedAt: raw.uploadedAt || raw.uploaded_at || raw.createdAt || new Date().toISOString()
    }
  })
}

export async function deleteAttachment(id: string) {
  await api.delete(`/attachments/${id}`)
}