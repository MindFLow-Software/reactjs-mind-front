export interface IpatientProfile {
  id: string
  userId: string
  psychologistPracticeContextId: string | null
  isActive: boolean
  archivedAt: Date | null
  createdAt: Date
  updatedAt: Date
}
