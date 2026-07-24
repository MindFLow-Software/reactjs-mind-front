import { useCallback } from 'react'

import type {
  IAnamnesisBlock,
  IAnamnesisDraft,
} from '../components/tabs/anamnesis/anamnesis-types'
import { createBlock } from '../components/tabs/anamnesis/anamnesis-utils'

const DRAFT_KEY_PREFIX = 'anamnesis-draft:'

const draftKey = (patientId: string): string =>
  `${DRAFT_KEY_PREFIX}${patientId}`

type IUseAnamnesisDraftReturn = {
  read: (patientId: string) => IAnamnesisBlock[]
  write: (patientId: string, blocks: IAnamnesisBlock[]) => void
  clear: (patientId: string) => void
}

export function useAnamnesisDraft(): IUseAnamnesisDraftReturn {
  const clear = useCallback((patientId: string) => {
    localStorage.removeItem(draftKey(patientId))
  }, [])

  const read = useCallback(
    (patientId: string): IAnamnesisBlock[] => {
      try {
        const raw = localStorage.getItem(draftKey(patientId))
        if (!raw) return []
        const parsed = JSON.parse(raw) as IAnamnesisDraft
        if (!Array.isArray(parsed?.blocks)) return []
        return parsed.blocks.map((block, index) => createBlock(block, index))
      } catch {
        clear(patientId)
        return []
      }
    },
    [clear],
  )

  const write = useCallback((patientId: string, blocks: IAnamnesisBlock[]) => {
    const draft: IAnamnesisDraft = { blocks, updatedAt: Date.now() }
    localStorage.setItem(draftKey(patientId), JSON.stringify(draft))
  }, [])

  return { read, write, clear }
}
