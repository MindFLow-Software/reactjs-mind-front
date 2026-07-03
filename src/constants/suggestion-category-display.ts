import type { SuggestionCategory } from '@/types/enums'

export interface SuggestionCategoryDisplay {
  label: string
  dot: string
  pillBg: string
  pillText: string
}

export const SUGGESTION_CATEGORY_DISPLAY: Record<
  SuggestionCategory,
  SuggestionCategoryDisplay
> = {
  UI_UX: {
    label: 'Fluxo',
    dot: 'bg-violet-500',
    pillBg: 'bg-violet-50 dark:bg-violet-950/30',
    pillText: 'text-violet-700 dark:text-violet-400',
  },
  REPORTS: {
    label: 'Relatórios',
    dot: 'bg-amber-500',
    pillBg: 'bg-amber-50 dark:bg-amber-950/30',
    pillText: 'text-amber-700 dark:text-amber-400',
  },
  INTEGRATIONS: {
    label: 'Integrações',
    dot: 'bg-blue-500',
    pillBg: 'bg-blue-50 dark:bg-blue-950/30',
    pillText: 'text-blue-700 dark:text-blue-400',
  },
  SCHEDULING: {
    label: 'Paciente',
    dot: 'bg-pink-500',
    pillBg: 'bg-pink-50 dark:bg-pink-950/30',
    pillText: 'text-pink-700 dark:text-pink-400',
  },
  PRIVACY_LGPD: {
    label: 'Financeiro',
    dot: 'bg-emerald-500',
    pillBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    pillText: 'text-emerald-700 dark:text-emerald-400',
  },
  OTHERS: {
    label: 'Outros',
    dot: 'bg-slate-400',
    pillBg: 'bg-slate-100 dark:bg-slate-800/50',
    pillText: 'text-slate-600 dark:text-slate-400',
  },
}
