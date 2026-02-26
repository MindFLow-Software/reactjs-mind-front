export interface SerializedBlock {
  id?: string
  title?: string
  content?: string
}

export interface AnamnesisBlock {
  id: string
  title: string
  content: string
}

export interface SectionAnchor {
  id: string
  label: string
}

export interface AnamnesisDraft {
  blocks: SerializedBlock[]
  updatedAt: number
}