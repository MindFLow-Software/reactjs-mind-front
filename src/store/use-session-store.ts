import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import type { IUser } from '@/types/user/user'

interface ISessionState {
  isAuthenticated: boolean
  user: IUser | null
  setSession: (user: IUser) => void
  clearSession: () => void
}

export const useSessionStore = create<ISessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setSession: (user) => set({ isAuthenticated: true, user }),
      clearSession: () => {
        set({ isAuthenticated: false, user: null })
        useActivePracticeContextStore.getState().clearActivePracticeContextId()
      },
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
