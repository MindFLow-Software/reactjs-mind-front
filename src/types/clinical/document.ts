import type { IAttachment } from '@/types/attachment/attachment'

export enum DocumentType {
  RG = 'RG',
  CPF = 'CPF',
  CNH = 'CNH',
  OTHER = 'OTHER',
}

export type IDocument = {
  id: string
  patientProfileId: string
  type: DocumentType
  attachment: IAttachment | null
  createdAt: string
}
