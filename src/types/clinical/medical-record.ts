import type { IAttachment } from '@/types/attachment/attachment'

export type IMedicalRecord = {
  id: string
  patientProfileId: string
  content: string | null
  attachment: IAttachment | null
  createdAt: string
}
