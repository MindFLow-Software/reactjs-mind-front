import {
  Lightbulb,
  Microscope,
  Rocket,
  Check,
  type LucideIcon,
} from 'lucide-react'
import { SuggestionCategory } from '@/types/suggestion/suggestion-category'
import { SuggestionStatus } from '@/types/suggestion/suggestion-status'

export interface SuggestionFilterCategory {
  value: SuggestionCategory
  label: string
  dot: string
}

export const SUGGESTION_FILTER_CATEGORIES: SuggestionFilterCategory[] = [
  { value: SuggestionCategory.UI_UX, label: 'Fluxo', dot: 'bg-violet-500' },
  {
    value: SuggestionCategory.REPORTS,
    label: 'Relatórios',
    dot: 'bg-amber-500',
  },
  {
    value: SuggestionCategory.INTEGRATIONS,
    label: 'Integrações',
    dot: 'bg-blue-500',
  },
  {
    value: SuggestionCategory.SCHEDULING,
    label: 'Paciente',
    dot: 'bg-pink-500',
  },
  {
    value: SuggestionCategory.PRIVACY_LGPD,
    label: 'Financeiro',
    dot: 'bg-emerald-500',
  },
  { value: SuggestionCategory.OTHERS, label: 'Outros', dot: 'bg-slate-400' },
]

export interface SuggestionColumnConfig {
  title: string
  icon: LucideIcon
  status: SuggestionStatus
  iconColor: string
  badgeClass: string
}

export const SUGGESTION_COLUMN_CONFIG: SuggestionColumnConfig[] = [
  {
    title: 'Votação',
    icon: Lightbulb,
    status: SuggestionStatus.OPEN,
    iconColor: 'text-blue-500',
    badgeClass:
      'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400',
  },
  {
    title: 'Em Estudo',
    icon: Microscope,
    status: SuggestionStatus.UNDER_REVIEW,
    iconColor: 'text-purple-500',
    badgeClass:
      'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400',
  },
  {
    title: 'Implementando',
    icon: Rocket,
    status: SuggestionStatus.PLANNED,
    iconColor: 'text-amber-500',
    badgeClass:
      'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
  },
  {
    title: 'Concluído',
    icon: Check,
    status: SuggestionStatus.IMPLEMENTED,
    iconColor: 'text-emerald-500',
    badgeClass:
      'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  },
]
