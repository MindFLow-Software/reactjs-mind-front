import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import type { IStatusPillOption } from './patients-list.types'

export const STATUS_PILLS: readonly IStatusPillOption[] = [
  {
    value: null,
    label: 'Todos',
    dot: null,
    activeCls: 'border border-blue-500 bg-background text-foreground',
  },
  {
    value: PatientProfileStatus.ACTIVE,
    label: 'Ativos',
    dot: 'bg-emerald-500',
    activeCls:
      'border border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  {
    value: PatientProfileStatus.INACTIVE,
    label: 'Inativos',
    dot: 'bg-amber-500',
    activeCls:
      'border border-amber-500 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    value: PatientProfileStatus.ARCHIVED,
    label: 'Arquivados',
    dot: 'bg-red-500',
    activeCls:
      'border border-red-500 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
]

export const NEW_PATIENTS_WINDOW_DAYS = 30

export const STATUS_TOGGLE_DISABLED_REASON =
  'Alterar status de pacientes está temporariamente indisponível.'
