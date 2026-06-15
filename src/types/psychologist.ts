export interface PsychologistProfile {
  id: string
  userId: string
  crp: string
  expertise: string
  professionalBio: string | null
  status: string
  isActive: boolean
  createdAt: string
}

export interface PsychologistPracticeContext {
  id: string
  psychologistProfileId: string
  contextType: 'INDIVIDUAL' | 'CLINIC'
  clinicId: string | null
  clinicBranchId: string | null
  consultationFee: number | null
  nickname: string | null
  isActive: boolean
  createdAt: string
}

export interface CreatePsychologistProfileBody {
  crp: string
  expertise: string
  professionalBio?: string | null
}

export interface CreatePracticeContextBody {
  contextType: 'INDIVIDUAL' | 'CLINIC'
  clinicId?: string | null
  clinicBranchId?: string | null
  consultationFee?: number | null
  nickname?: string | null
}
