import { createContext, useContext } from 'react'
import type { IAnamnesisBlock } from './anamnesis-types'

export enum AnamnesisSaveStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  DRAFT = 'draft',
}

export type IAnamnesisSection = {
  id: string
  label: string
  wordCount: number
}

type IAnamnesisEditorContextValue = {
  saveStatus: AnamnesisSaveStatus
  canDeleteBlocks: boolean
  activeBlockId: string | null
  sections: IAnamnesisSection[]
  updateBlock: (id: string, updates: Partial<IAnamnesisBlock>) => void
  deleteBlock: (id: string) => void
  setActiveBlockId: (id: string | null) => void
  jumpToBlock: (id: string) => void
  registerRef: (id: string, el: HTMLTextAreaElement | null) => void
  onFormat: (marker: string) => void
}

export const AnamnesisEditorContext =
  createContext<IAnamnesisEditorContextValue | null>(null)

export function useAnamnesisContext(): IAnamnesisEditorContextValue {
  const ctx = useContext(AnamnesisEditorContext)
  if (!ctx)
    throw new Error(
      'useAnamnesisContext must be used inside AnamnesisEditorContext.Provider',
    )
  return ctx
}
