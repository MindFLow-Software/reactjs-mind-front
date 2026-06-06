import { memo } from 'react'
import { Users } from 'lucide-react'
import { usePatientsAmount } from '../hooks/use-patients-amount'
import { MetricCard } from './metric-card'

export const PatientsAmountCard = memo(function PatientsAmountCard() {
  const { total, delta, isLoading, isError } = usePatientsAmount()

  return (
    <MetricCard
      isLoading={isLoading}
      isError={isError}
      accentColor="blue"
      label="Pacientes ativos"
      icon={<Users className="size-4 text-blue-500" />}
    >
      <MetricCard.Value>{total.toLocaleString('pt-BR')}</MetricCard.Value>
      {delta !== null && delta > 0 && (
        <MetricCard.Trend direction="up" label="vs. 30 dias anteriores">
          +{delta}
        </MetricCard.Trend>
      )}
    </MetricCard>
  )
})
