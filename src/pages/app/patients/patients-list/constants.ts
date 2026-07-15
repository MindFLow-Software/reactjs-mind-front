import {
  PatientStatusFilter,
  type IStatusPillOption,
} from './patients-list.types'

export const STATUS_PILLS: readonly IStatusPillOption[] = [
  {
    value: null,
    label: 'Todos',
    dot: null,
    activeCls: 'border border-blue-500 bg-background text-foreground',
  },
  {
    value: PatientStatusFilter.ACTIVE,
    label: 'Ativos',
    dot: 'bg-emerald-500',
    activeCls:
      'border border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    value: PatientStatusFilter.BLOCKED,
    label: 'Arquivados',
    dot: 'bg-red-500',
    activeCls:
      'border border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
]

export const STATUS_TO_IS_ACTIVE: Partial<
  Record<PatientStatusFilter, boolean>
> = {
  [PatientStatusFilter.ACTIVE]: true,
  [PatientStatusFilter.BLOCKED]: false,
}

export const NEW_PATIENTS_WINDOW_DAYS = 30

export const STATUS_TOGGLE_DISABLED_REASON =
  'Alterar status de pacientes está temporariamente indisponível.'
