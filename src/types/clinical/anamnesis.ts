import type { IAnamnesisSection } from './anamnesis-section'

export type IAnamnesis = {
  id: string
  patientProfileId: string
  isDraft: boolean
  sections: IAnamnesisSection[]
}
