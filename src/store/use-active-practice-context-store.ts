import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ActivePracticeContextState = {
  activePracticeContextId: string | null
  setActivePracticeContextId: (id: string) => void
  clearActivePracticeContextId: () => void
}

export const useActivePracticeContextStore =
  create<ActivePracticeContextState>()(
    persist(
      (set) => ({
        activePracticeContextId: null,
        setActivePracticeContextId: (id) =>
          set({ activePracticeContextId: id }),
        clearActivePracticeContextId: () =>
          set({ activePracticeContextId: null }),
      }),
      {
        name: 'active-practice-context',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  )
