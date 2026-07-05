export interface IClinic {
  id: string
  legalName: string
  tradeName: string | null
  cnpj: string
  email: string | null
  phoneNumber: string | null
  website: string | null
  bannerUrl: string | null
  logoUrl: string | null
  isActive: boolean
  responsibleMemberId: string | null
  createdAt: string
  updatedAt: string
}

export interface IClinicBranch extends IClinic {
  clinicId: string
}

export interface IClinicMember {
  id: string
  userId: string
  clinicId: string | null
  branchId: string | null
  memberRole: string
  createdAt: string
  updatedAt: string
}

export interface IClinicPsychologist {
  id: string
  psychologistProfileId: string
  practiceContextId: string
  clinicId: string | null
  branchId: string | null
  createdAt: string
}
