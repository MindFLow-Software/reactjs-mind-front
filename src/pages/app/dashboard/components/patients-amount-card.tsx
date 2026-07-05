import { memo } from 'react'
import { Users } from 'lucide-react'
import { usePatientsAmount } from '../hooks/use-patients-amount'
import { MetricCard } from '@/components/metric-card'

export const PatientsAmountCard = memo(function PatientsAmountCard() {
  const { total, delta, isLoading, isError } = usePatientsAmount()

  return (
    <MetricCard variant="stacked" accentColor="blue" isLoading={isLoading}>
      <MetricCard.Header
        icon={<Users className="size-4 text-blue-500" />}
        label="Pacientes ativos"
        accentColor="blue"
      />
      <MetricCard.Body isError={isError}>
        <MetricCard.Value>{total.toLocaleString('pt-BR')}</MetricCard.Value>
        {delta !== null && delta > 0 && (
          <MetricCard.Trend direction="up" label="vs. 30 dias anteriores">
            +{delta}
          </MetricCard.Trend>
        )}
      </MetricCard.Body>
    </MetricCard>
  )
})
