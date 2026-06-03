import { Mars, Venus, Users } from 'lucide-react'

export const GENDER_CONFIG = {
  MASCULINE: {
    label: 'Masculino',
    icon: Mars,
    className:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0',
  },
  FEMININE: {
    label: 'Feminino',
    icon: Venus,
    className:
      'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-0',
  },
  OTHER: {
    label: 'Outro',
    icon: Users,
    className:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0',
  },
} as const
