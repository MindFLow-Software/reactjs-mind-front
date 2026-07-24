import { useCallback } from 'react'

import type { IAnamnesisSection } from '@/types/clinical/anamnesis-section'
import type { IAnamnesisDraft } from '../components/tabs/anamnesis/anamnesis-types'
import { normalizeSections } from '../components/tabs/anamnesis/anamnesis-utils'

const DRAFT_KEY_PREFIX = 'anamnesis-draft:'

const draftKey = (patientProfileId: string): string =>
  `${DRAFT_KEY_PREFIX}${patientProfileId}`

type IUseAnamnesisDraftReturn = {
  read: (patientProfileId: string) => IAnamnesisSection[]
  write: (patientProfileId: string, sections: IAnamnesisSection[]) => void
  clear: (patientProfileId: string) => void
}

export function useAnamnesisDraft(): IUseAnamnesisDraftReturn {
  const clear = useCallback((patientProfileId: string) => {
    localStorage.removeItem(draftKey(patientProfileId))
  }, [])

  const read = useCallback(
    (patientProfileId: string): IAnamnesisSection[] => {
      try {
        const raw = localStorage.getItem(draftKey(patientProfileId))
        if (!raw) return []
        const parsed = JSON.parse(raw) as IAnamnesisDraft
        if (!Array.isArray(parsed?.sections) || parsed.sections.length === 0) {
          return []
        }
        return normalizeSections(parsed.sections)
      } catch {
        clear(patientProfileId)
        return []
      }
    },
    [clear],
  )

  const write = useCallback(
    (patientProfileId: string, sections: IAnamnesisSection[]) => {
      const draft: IAnamnesisDraft = { sections, updatedAt: Date.now() }
      localStorage.setItem(draftKey(patientProfileId), JSON.stringify(draft))
    },
    [],
  )

  return { read, write, clear }
}
