import { cn } from '@/lib/utils'
import { PASSWORD_STRENGTH_LEVELS } from '@/pages/auth/constants'

export function PasswordStrength({ value }: { value: string }) {
  const getPasswordStrength = (value: string) => {
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

  const { score, barColor, labelColor, label } = getPasswordStrength(value)

  if (!value) return null

  return (
    <div className="mt-1 space-y-1 w-full">
      <div className="flex gap-0.5">
        {Array.from({ length: PASSWORD_STRENGTH_LEVELS.length }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i <= score ? barColor : 'bg-muted',
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-[10px] text-muted-foreground">
          Use maiúsc., minúsc., número e símbolo
        </p>
        {label && (
          <p className={cn('text-[10px] font-semibold', labelColor)}>{label}</p>
        )}
      </div>
    </div>
  )
}
