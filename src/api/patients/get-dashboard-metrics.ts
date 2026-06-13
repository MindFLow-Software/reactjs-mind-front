import { api } from '@/lib/axios'

export interface DashboardMetrics {
  activePatients: number
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await api.get<DashboardMetrics>('/dashboard')
  return response.data
}
