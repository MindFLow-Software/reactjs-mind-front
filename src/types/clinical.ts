import type { IAttachment } from '@/types/attachment/attachment'

export const DocumentType = {
  RG: 'RG',
  CPF: 'CPF',
  CNH: 'CNH',
  OTHER: 'OTHER',
} as const
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType]

export interface IAnamnesis {
  id: string
  patientId: string
  content: Record<string, unknown>
  createdAt: string
}

export interface IAnamnesisContent {
  chiefComplaint: string
  familyHistory: string
  personalHistory: string
  medicalHistory: string
}

export interface IDocument {
  id: string
  patientProfileId: string
  type: DocumentType
  attachment: IAttachment | null
  createdAt: string
}

export interface IMedicalRecord {
  id: string
  patientProfileId: string
  content: string | null
  attachment: IAttachment | null
  createdAt: string
}

export interface IObservation {
  id: string
  patientProfileId: string
  content: string
  createdAt: string
}
