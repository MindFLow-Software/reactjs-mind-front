import { api } from "@/lib/axios"

export interface UpdateAppointmentRequest {
  id: string
  diagnosis?: string
  notes?: string
  scheduledAt?: Date
}

export async function updateAppointment({
  id,
  diagnosis,
  notes,
  scheduledAt,
}: UpdateAppointmentRequest) {
  await api.put(`/appointments/${id}`, {
    diagnosis,
    notes,
    scheduledAt: scheduledAt?.toISOString(),
  })
}