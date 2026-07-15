import { createContext, useContext } from 'react'
import type { IAnamnesisBlock } from './anamnesis-types'

export type SaveStatus = 'synced' | 'pending' | 'draft'

export interface AnamnesisSection {
  id: string
  label: string
  wordCount: number
}

interface AnamnesisEditorContextValue {
  saveStatus: SaveStatus
  canDeleteBlocks: boolean
  activeBlockId: string | null
  sections: AnamnesisSection[]
  updateBlock: (id: string, updates: Partial<IAnamnesisBlock>) => void
  deleteBlock: (id: string) => void
  setActiveBlockId: (id: string | null) => void
  jumpToBlock: (id: string) => void
  registerRef: (id: string, el: HTMLTextAreaElement | null) => void
  onFormat: (marker: string) => void
}

export const AnamnesisEditorContext =
  createContext<AnamnesisEditorContextValue | null>(null)

export function useAnamnesisContext(): AnamnesisEditorContextValue {
  const ctx = useContext(AnamnesisEditorContext)
  if (!ctx)
    throw new Error(
      'useAnamnesisContext must be used inside AnamnesisEditorContext.Provider',
    )
  return ctx
}
