import { api } from '@/lib/axios'
import type { IPatientDashboardPayload } from '@/types/dashboard'

export async function getPatientDashboard(
  patientProfileId?: string,
): Promise<IPatientDashboardPayload> {
  const response = await api.get('/dashboard/patient', {
    headers: patientProfileId
      ? { 'x-patient-profile-id': patientProfileId }
      : undefined,
  })

  return response.data
}
