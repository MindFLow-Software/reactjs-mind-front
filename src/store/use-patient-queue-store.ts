import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type PatientQueueSource = 'patients-records' | 'patients-list'

interface IPatientQueueState {
  queue: string[]
  source: PatientQueueSource | null
  setQueue: (queue: string[], source: PatientQueueSource) => void
  clearQueue: () => void
}

export const usePatientQueueStore = create<IPatientQueueState>()(
  persist(
    (set) => ({
      queue: [],
      source: null,
      setQueue: (queue, source) => set({ queue, source }),
      clearQueue: () => set({ queue: [], source: null }),
    }),
    {
      name: 'active_patient_queue',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
