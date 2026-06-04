import { create } from 'zustand'

type IheaderStore = {
  title: string
  titleHref?: string
  subtitle?: string
  subtitleHref?: string
  setTitle: (newTitle: string, href?: string) => void
  setSubtitle: (newSubtitle?: string, href?: string) => void
}

export const useHeaderStore = create<IheaderStore>((set) => ({
  title: '',
  titleHref: undefined,
  subtitle: undefined,
  subtitleHref: undefined,
  setTitle: (newTitle, href) => set({ title: newTitle, titleHref: href }),
  setSubtitle: (newSubtitle, href) =>
    set({ subtitle: newSubtitle, subtitleHref: href }),
}))
