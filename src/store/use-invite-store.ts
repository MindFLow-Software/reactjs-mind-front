import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface IInviteState {
  inviteData: { url: string; hash: string } | null
  setInviteData: (data: { url: string; hash: string } | null) => void
}

export const useInviteStore = create<IInviteState>()(
  persist(
    (set) => ({
      inviteData: null,
      setInviteData: (data) => set({ inviteData: data }),
    }),
    {
      name: 'mindflush-invite-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
