export type ISaveAnamnesisSectionInput = {
  id?: string | null
  title: string
  content: string
  order: number
}

export type ISaveAnamnesisBody = {
  isDraft?: boolean
  sections: ISaveAnamnesisSectionInput[]
}
