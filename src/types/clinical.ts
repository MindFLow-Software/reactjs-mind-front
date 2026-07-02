export interface Anamnesis {
  patientProfileId: string | null
  content: Record<string, unknown>
  updatedAt: string
}

export interface Document {
  id: string
  patientProfileId: string
  attachmentId: string | null
  type: 'RG' | 'CPF' | 'CNH' | 'OTHER'
  createdAt: string
}

export interface MedicalRecord {
  id: string
  patientProfileId: string
  attachmentId: string | null
  content: string | null
  createdAt: string
  updatedAt: string
}

export interface Observation {
  id: string
  patientProfileId: string
  content: string
  createdAt: string
  updatedAt: string
}
