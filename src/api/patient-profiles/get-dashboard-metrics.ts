import { api } from '@/lib/axios'

export interface DashboardMetrics {
  activePatients: number
}

// TODO: move from /patients folder, it doesn't belongs to patient
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await api.get<DashboardMetrics>('/dashboard')
  return response.data
}
