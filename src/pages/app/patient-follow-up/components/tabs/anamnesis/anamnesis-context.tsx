import { createContext, useContext } from 'react'

import type { IAnamnesisSection } from '@/types/clinical/anamnesis-section'

export enum AnamnesisSaveStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  DRAFT = 'draft',
}

export type IAnamnesisNavSection = {
  id: string
  label: string
  wordCount: number
}

type IAnamnesisEditorContextValue = {
  saveStatus: AnamnesisSaveStatus
  canDeleteSections: boolean
  activeSectionId: string | null
  sections: IAnamnesisNavSection[]
  isDraft: boolean
  canPublish: boolean
  updateSection: (id: string, updates: Partial<IAnamnesisSection>) => void
  deleteSection: (id: string) => void
  setActiveSectionId: (id: string | null) => void
  jumpToSection: (id: string) => void
  reorderSections: (ids: string[]) => void
  onPublish: () => void
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
