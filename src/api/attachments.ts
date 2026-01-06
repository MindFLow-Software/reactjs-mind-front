import { api } from "@/lib/axios"

export async function getPatientAttachments(patientId: string) {
    const response = await api.get(`/attachments/patient/${patientId}`)
    return response.data.attachments
}

export async function deleteAttachment(id: string) {
    await api.delete(`/attachments/${id}`)
}