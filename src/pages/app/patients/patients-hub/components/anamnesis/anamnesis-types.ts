export type ISerializedBlock = {
  id?: string
  title?: string
  content?: string
}

export type IAnamnesisBlock = {
  id: string
  title: string
  content: string
}

export type IAnamnesisDraft = {
  blocks: ISerializedBlock[]
  updatedAt: number
}
