import { api } from "@/lib/axios"

export interface AnamnesisData {
  chiefComplaint: string
  familyHistory: string
  personalHistory: string
  medicalHistory: string
}

export async function getAnamnesis(patientId: string): Promise<AnamnesisData> {
  const response = await api.get(`/patients/${patientId}/anamnesis`)
  return response.data.anamnesis
}

export async function saveAnamnesis(patientId: string, data: AnamnesisData) {
  await api.put(`/patients/${patientId}/anamnesis`, data)
}