import type { IPatientDashboardInner } from '@/types/dashboard/patient-dashboard-inner'

export type IPatientDashboardPayload = {
  hasPatientProfile: boolean
  data: IPatientDashboardInner
}
