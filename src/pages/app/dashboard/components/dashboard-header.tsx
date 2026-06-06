import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { usePsychologistProfile } from '@/hooks/use-psychologist-profile'
import type { DashboardPeriod } from '../constants'
import { PERIODS } from '../constants'
import { getGreeting } from '../helpers'
import { useTodayAppointments } from '../hooks/use-today-appointments'

interface DashboardHeaderProps {
  period: DashboardPeriod
  onPeriodChange: (p: DashboardPeriod) => void
}

export function DashboardHeader({
  period,
  onPeriodChange,
}: DashboardHeaderProps) {
  const { data: profile } = usePsychologistProfile()
  const { count: appointmentCount } = useTodayAppointments()

  const formattedDate = useMemo(
    () => format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }),
    [],
  )

  const title = profile?.gender === 'FEMININE' ? 'Dra.' : 'Dr.'
  const name = profile
    ? `${title} ${profile.firstName} ${profile.lastName}`
    : ''

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {getGreeting()}
          {name ? `, ${name}` : ''}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground capitalize">
          {formattedDate}
          {appointmentCount > 0 &&
            ` · ${appointmentCount} ${appointmentCount === 1 ? 'sessão hoje' : 'sessões hoje'}`}
        </p>
      </div>

      <div className="flex items-center gap-1 self-start rounded-lg border border-border bg-muted/30 p-1">
        {PERIODS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onPeriodChange(value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-all cursor-pointer',
              period === value
                ? 'bg-blue-700 text-background shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
