export type IClinicMember = {
  id: string
  userId: string
  clinicId: string | null
  branchId: string | null
  memberRole: string
  createdAt: string
  updatedAt: string
}
