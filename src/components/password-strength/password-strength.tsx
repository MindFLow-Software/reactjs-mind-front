import { cn } from '@/lib/utils'
import { PASSWORD_STRENGTH_LEVELS } from '@/constants/password-strength-levels'

import './password-strength.css'

type IPasswordStrength = {
  value: string
}

function getPasswordStrength(value: string) {
  const checks = [
    value.length >= 8 && value.length <= 30,
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /\d/.test(value),
    /[!@#$%^&*]/.test(value),
  ]

  const score = checks.filter(Boolean).length

  const strength = PASSWORD_STRENGTH_LEVELS.find(
    (level) => score <= level.maxScore,
  )

  return {
    score,
    barColor: strength?.barColor ?? 'bg-muted',
    labelColor: strength?.labelColor ?? 'text-muted-foreground',
    label: score === 0 ? '' : (strength?.label ?? ''),
  }
}

export function PasswordStrength({ value }: IPasswordStrength) {
  const { score, barColor, labelColor, label } = getPasswordStrength(value)

  if (!value) return null

  return (
    <div className="ps-root">
      <div className="ps-bars">
        {Array.from({ length: PASSWORD_STRENGTH_LEVELS.length }).map((_, i) => (
          <div key={i} className={cn('ps-bar', i <= score && barColor)} />
        ))}
      </div>
      <div className="ps-footer">
        <p className="ps-hint">Use maiúsc., minúsc., número e símbolo</p>
        {label && <p className={cn('ps-label', labelColor)}>{label}</p>}
      </div>
    </div>
  )
}
