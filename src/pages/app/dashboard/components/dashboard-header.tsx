import { useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import type { DashboardPeriod } from '../constants'
import { PERIODS } from '../constants'
import { getGreeting } from '../helpers'
import { useTodayAppointments } from '../hooks/use-today-appointments'
import './dashboard-header.css'
import { useAuth } from '@/hooks/use-auth'
import { translatedHonorific } from '@/constants/translated-honorific'

interface DashboardHeaderProps {
  period: DashboardPeriod
  onPeriodChange: (p: DashboardPeriod) => void
}

export function DashboardHeader({
  period,
  onPeriodChange,
}: DashboardHeaderProps) {
  const { profile } = useAuth()
  const { count: appointmentCount } = useTodayAppointments()

  const formattedDate = useMemo(
    () => format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }),
    [],
  )

  const targetHonorific = profile?.psychologistProfile?.honorific
  const honorific = targetHonorific && translatedHonorific[targetHonorific]

  const fullName = profile ? `${profile?.firstName} ${profile?.lastName}` : ''
  const title = honorific ? `${honorific} ${fullName}` : fullName

  return (
    <div className="dsh-header-root">
      <div>
        <h1 className="dsh-header-title">
          {getGreeting()}
          {`, ${title}`}
        </h1>
        <p className="dsh-header-date">
          {formattedDate}
          {appointmentCount > 0 &&
            ` · ${appointmentCount} ${appointmentCount === 1 ? 'sessão hoje' : 'sessões hoje'}`}
        </p>
      </div>

      <div className="dsh-header-periods">
        {PERIODS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onPeriodChange(value)}
            className={cn(
              'dsh-header-period-btn',
              period === value && 'dsh-header-period-btn--active',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
