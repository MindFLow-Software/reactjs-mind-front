import { api } from "@/lib/axios"

export interface UpdateAppointmentRequest {
  id: string
  diagnosis?: string
  notes?: string
  content?: string | null
  scheduledAt?: Date
  status?: string
}

export async function updateAppointment({
  id,
  diagnosis,
  content,
  scheduledAt,
  status,
}: UpdateAppointmentRequest) {
  await api.put(`/appointments/${id}`, {
    diagnosis,
    content,
    status,
    scheduledAt: scheduledAt?.toISOString(),
  })
}