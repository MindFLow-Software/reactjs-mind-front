import type { IClinic } from '@/types/clinic/clinic'

export type IClinicBranch = IClinic & {
  clinicId: string
}
