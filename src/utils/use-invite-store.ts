import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface InviteState {
  inviteData: { url: string; hash: string } | null
  setInviteData: (data: { url: string; hash: string } | null) => void
}

export const useInviteStore = create<InviteState>()(
  persist(
    (set) => ({
      inviteData: null,
      setInviteData: (data) => set({ inviteData: data }),
    }),
    {
      name: 'mindflush-invite-storage', // Nome da chave no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)