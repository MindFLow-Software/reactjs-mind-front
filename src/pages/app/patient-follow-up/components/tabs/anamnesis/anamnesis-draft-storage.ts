import type { IAnamnesisBlock, IAnamnesisDraft } from './anamnesis-types'
import { createBlock } from './anamnesis-utils'

const DRAFT_KEY_PREFIX = 'anamnesis-draft:'

const draftKey = (patientId: string): string =>
  `${DRAFT_KEY_PREFIX}${patientId}`

export function readAnamnesisDraft(patientId: string): IAnamnesisBlock[] {
  try {
    const raw = localStorage.getItem(draftKey(patientId))
    if (!raw) return []
    const parsed = JSON.parse(raw) as IAnamnesisDraft
    if (!Array.isArray(parsed?.blocks)) return []
    return parsed.blocks.map((block, index) => createBlock(block, index))
  } catch {
    clearAnamnesisDraft(patientId)
    return []
  }
}

export function writeAnamnesisDraft(
  patientId: string,
  blocks: IAnamnesisBlock[],
): void {
  const draft: IAnamnesisDraft = { blocks, updatedAt: Date.now() }
  localStorage.setItem(draftKey(patientId), JSON.stringify(draft))
}

export function clearAnamnesisDraft(patientId: string): void {
  localStorage.removeItem(draftKey(patientId))
}
