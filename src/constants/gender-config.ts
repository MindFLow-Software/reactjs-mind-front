import { Mars, Venus, Users } from 'lucide-react'
import { Gender } from '@/types/shared/enums'

export const GENDER_SLICE_COLOR: Record<Gender, string> = {
  [Gender.FEMININE]: 'var(--gender-feminine)',
  [Gender.MASCULINE]: 'var(--gender-masculine)',
  [Gender.OTHER]: 'var(--gender-other)',
}

export const GENDER_CONFIG = {
  [Gender.MASCULINE]: {
    label: 'Masculino',
    icon: Mars,
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0',
  },
  [Gender.FEMININE]: {
    label: 'Feminino',
    icon: Venus,
    className:
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-0',
  },
  [Gender.OTHER]: {
    label: 'Outro',
    icon: Users,
    className:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0',
  },
} as const
