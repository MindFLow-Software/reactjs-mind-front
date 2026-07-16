import {
  Activity,
  BarChart2,
  Zap,
  Heart,
  Shield,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react'
import type { CreateSuggestionSchema } from '@/validators/suggestions/form/create-suggestion-schema'

export type SuggestionCategoryValue = CreateSuggestionSchema['category']

export type CreateCategoryConfig = {
  value: SuggestionCategoryValue
  label: string
  description: string
  icon: LucideIcon
  iconColor: string
  iconBg: string
}

export const CREATE_SUGGESTION_CATEGORIES: CreateCategoryConfig[] = [
  {
    value: 'UI_UX',
    label: 'Interface e Visual',
    description: 'UI/UX, design, usabilidade',
    icon: Activity,
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-950/40',
  },
  {
    value: 'SCHEDULING',
    label: 'Agenda e Consultas',
    description: 'Horários, sessões, calendário',
    icon: Heart,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-950/40',
  },
  {
    value: 'REPORTS',
    label: 'Relatórios',
    description: 'Financeiro, gráficos, exports',
    icon: BarChart2,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-950/40',
  },
  {
    value: 'PRIVACY_LGPD',
    label: 'Segurança e LGPD',
    description: 'Privacidade, dados, proteção',
    icon: Shield,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/40',
  },
  {
    value: 'INTEGRATIONS',
    label: 'Integrações Externas',
    description: 'WhatsApp, Google, APIs',
    icon: Zap,
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'bg-indigo-100 dark:bg-indigo-950/40',
  },
  {
    value: 'OTHERS',
    label: 'Outros Assuntos',
    description: 'Qualquer outra sugestão',
    icon: HelpCircle,
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-100 dark:bg-slate-800/50',
  },
]

export const SUGGESTION_DESCRIPTION_MIN = 200
