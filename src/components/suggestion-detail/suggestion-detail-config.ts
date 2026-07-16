import { SuggestionStatus } from '@/types/suggestion/suggestion-status'

export enum SuggestionStepState {
  DONE = 'DONE',
  CURRENT = 'CURRENT',
  PENDING = 'PENDING',
}

export type ISuggestionStatusDisplay = {
  label: string
  bannerBg: string
  bannerText: string
  blobColor: string
  currentStep: number
}

export const SUGGESTION_STATUS_DISPLAY: Record<
  SuggestionStatus,
  ISuggestionStatusDisplay
> = {
  [SuggestionStatus.PENDING]: {
    label: 'AGUARDANDO',
    bannerBg: 'bg-blue-50 dark:bg-blue-950/30',
    bannerText: 'text-blue-700 dark:text-blue-400',
    blobColor: 'bg-blue-500',
    currentStep: 0,
  },
  [SuggestionStatus.OPEN]: {
    label: 'EM VOTAÇÃO',
    bannerBg: 'bg-blue-50 dark:bg-blue-950/30',
    bannerText: 'text-blue-700 dark:text-blue-400',
    blobColor: 'bg-blue-500',
    currentStep: 1,
  },
  [SuggestionStatus.UNDER_REVIEW]: {
    label: 'EM ESTUDO',
    bannerBg: 'bg-purple-50 dark:bg-purple-950/30',
    bannerText: 'text-purple-700 dark:text-purple-400',
    blobColor: 'bg-purple-500',
    currentStep: 2,
  },
  [SuggestionStatus.PLANNED]: {
    label: 'IMPLEMENTANDO',
    bannerBg: 'bg-amber-50 dark:bg-amber-950/30',
    bannerText: 'text-amber-700 dark:text-amber-400',
    blobColor: 'bg-amber-500',
    currentStep: 3,
  },
  [SuggestionStatus.IMPLEMENTED]: {
    label: 'CONCLUÍDO',
    bannerBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    bannerText: 'text-emerald-700 dark:text-emerald-400',
    blobColor: 'bg-emerald-500',
    currentStep: 4,
  },
  [SuggestionStatus.REJECTED]: {
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

export type ISuggestionStepProgress = {
  doneUntil: number
  currentIdx: number
}

export const SUGGESTION_TIMELINE_PROGRESS: Record<
  SuggestionStatus,
  ISuggestionStepProgress
> = {
  [SuggestionStatus.PENDING]: { doneUntil: 0, currentIdx: 1 },
  [SuggestionStatus.OPEN]: { doneUntil: 1, currentIdx: 2 },
  [SuggestionStatus.UNDER_REVIEW]: { doneUntil: 2, currentIdx: 3 },
  [SuggestionStatus.PLANNED]: { doneUntil: 3, currentIdx: 4 },
  [SuggestionStatus.IMPLEMENTED]: { doneUntil: 6, currentIdx: -1 },
  [SuggestionStatus.REJECTED]: { doneUntil: -1, currentIdx: -1 },
}

export function resolveStepState(
  index: number,
  progress: ISuggestionStepProgress,
): SuggestionStepState {
  if (index <= progress.doneUntil) return SuggestionStepState.DONE
  if (index === progress.currentIdx) return SuggestionStepState.CURRENT

  return SuggestionStepState.PENDING
}

export function bannerStepProgress(
  status: SuggestionStatus,
): ISuggestionStepProgress {
  const { currentStep } = SUGGESTION_STATUS_DISPLAY[status]

  return { doneUntil: currentStep - 1, currentIdx: currentStep }
}
