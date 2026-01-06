import { api } from "@/lib/axios"

interface UploadAttachmentResponse {
    attachmentId: string
    url: string
}

export async function uploadAttachment(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadAttachmentResponse>("/attachments", formData)
    
    return response.data
}

export async function getPatientAttachments(patientId: string) {
    const response = await api.get(`/attachments/patient/${patientId}`)
    return response.data.attachments
}

export async function deleteAttachment(id: string) {
    await api.delete(`/attachments/${id}`)
}