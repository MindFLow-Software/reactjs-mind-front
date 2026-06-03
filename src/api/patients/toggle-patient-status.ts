import { api } from "@/lib/axios"

export async function togglePatientStatus(id: string) {
  await api.patch(`/patients/${id}/status`)
}