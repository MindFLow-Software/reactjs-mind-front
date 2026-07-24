import type { IAnamnesisSection } from '@/types/clinical/anamnesis-section'

export type IAnamnesisDraft = {
  sections: IAnamnesisSection[]
  updatedAt: number
}
