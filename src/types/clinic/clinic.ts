export type IClinic = {
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
