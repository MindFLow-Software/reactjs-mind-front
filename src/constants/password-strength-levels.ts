type IPasswordStrengthLevel = {
  maxScore: 1 | 2 | 3 | 4 | 5
  barColor: string
  labelColor: string
  label: string
}

export const PASSWORD_STRENGTH_LEVELS: IPasswordStrengthLevel[] = [
  {
    maxScore: 1,
    barColor: 'bg-red-500',
    labelColor: 'text-red-500',
    label: 'Fraca',
  },
  {
    maxScore: 2,
    barColor: 'bg-orange-400',
    labelColor: 'text-orange-500',
    label: 'Razoável',
  },
  {
    maxScore: 3,
    barColor: 'bg-yellow-500',
    labelColor: 'text-yellow-600',
    label: 'Boa',
  },
  {
    maxScore: 4,
    barColor: 'bg-blue-500',
    labelColor: 'text-blue-600',
    label: 'Forte',
  },
  {
    maxScore: 5,
    barColor: 'bg-green-500',
    labelColor: 'text-green-600',
    label: 'Muito forte',
  },
]
