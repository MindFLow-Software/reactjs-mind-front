import type { SuggestionStatus } from '@/types/suggestion/suggestion-status'

export interface SuggestionStatusDisplay {
  label: string
  bannerBg: string
  bannerText: string
  blobColor: string
  currentStep: number
}

export const SUGGESTION_STATUS_DISPLAY: Record<
  SuggestionStatus,
  SuggestionStatusDisplay
> = {
  PENDING: {
    label: 'AGUARDANDO',
    bannerBg: 'bg-blue-50 dark:bg-blue-950/30',
    bannerText: 'text-blue-700 dark:text-blue-400',
    blobColor: 'bg-blue-500',
    currentStep: 0,
  },
  OPEN: {
    label: 'EM VOTAÇÃO',
    bannerBg: 'bg-blue-50 dark:bg-blue-950/30',
    bannerText: 'text-blue-700 dark:text-blue-400',
    blobColor: 'bg-blue-500',
    currentStep: 1,
  },
  UNDER_REVIEW: {
    label: 'EM ESTUDO',
    bannerBg: 'bg-purple-50 dark:bg-purple-950/30',
    bannerText: 'text-purple-700 dark:text-purple-400',
    blobColor: 'bg-purple-500',
    currentStep: 2,
  },
  PLANNED: {
    label: 'IMPLEMENTANDO',
    bannerBg: 'bg-amber-50 dark:bg-amber-950/30',
    bannerText: 'text-amber-700 dark:text-amber-400',
    blobColor: 'bg-amber-500',
    currentStep: 3,
  },
  IMPLEMENTED: {
    label: 'CONCLUÍDO',
    bannerBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    bannerText: 'text-emerald-700 dark:text-emerald-400',
    blobColor: 'bg-emerald-500',
    currentStep: 4,
  },
  REJECTED: {
    label: 'REJEITADA',
    bannerBg: 'bg-red-50 dark:bg-red-950/30',
    bannerText: 'text-red-700 dark:text-red-400',
    blobColor: 'bg-red-500',
    currentStep: -1,
  },
}

export const SUGGESTION_BANNER_STEPS = [
  'Aprovada',
  'Em votação',
  'Em estudo',
  'Implementando',
  'Concluído',
] as const

export const SUGGESTION_TIMELINE_STEPS = [
  'Sugestão enviada',
  'Aprovada pela moderação',
  'Em votação aberta',
  'Em estudo pela equipe',
  'Implementando',
  'Beta privado',
  'Disponível para todos',
] as const

export interface SuggestionTimelineProgress {
  doneUntil: number
  currentIdx: number
}

export const SUGGESTION_TIMELINE_PROGRESS: Record<
  SuggestionStatus,
  SuggestionTimelineProgress
> = {
  PENDING: { doneUntil: 0, currentIdx: 1 },
  OPEN: { doneUntil: 1, currentIdx: 2 },
  UNDER_REVIEW: { doneUntil: 2, currentIdx: 3 },
  PLANNED: { doneUntil: 3, currentIdx: 4 },
  IMPLEMENTED: { doneUntil: 6, currentIdx: -1 },
  REJECTED: { doneUntil: -1, currentIdx: -1 },
}

export function buildAttachmentUrl(id: string): string {
  const base =
    (import.meta.env.VITE_API_URL as string | undefined)?.trim() ??
    'http://localhost:8080'
  return `${base}/attachments/${id}`
}
