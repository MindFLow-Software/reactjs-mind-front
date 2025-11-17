import { useMemo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { HeartHandshake, } from 'lucide-react'
import { getAmountPatientsCard } from '@/api/get-amount-patients-card'
import { cn } from '@/lib/utils'

interface PatientData {
  total: number
}

const fetchPatientTotal = async (): Promise<PatientData> => {
  try {
    return await getAmountPatientsCard()
  } catch (error) {
    console.error('Erro ao buscar total de pacientes:', error)
    throw error
  }
}

export const PatientsAmountCard = () => {
  const [state, setState] = useState<{
    total: number | null
    isLoading: boolean
    isError: boolean
  }>({ total: null, isLoading: true, isError: false })

  useEffect(() => {
    fetchPatientTotal()
      .then(data => setState({ total: data.total, isLoading: false, isError: false }))
      .catch(() => setState(prev => ({ ...prev, isLoading: false, isError: true })))
  }, [])

  const { displayValue, percentageText, percentageColor } = useMemo(() => ({
    displayValue: state.total ?? '—',
    percentageText: '+8%',
    percentageColor: 'text-emerald-500 dark:text-emerald-400'
  }), [state.total])

  return (
    <Card className={cn(
      "relative overflow-hidden",
      "rounded-2xl",
      "border border-border border-b-[3px]",
      "shadow-sm shadow-black/8",
    )}>
      <div
        className={cn(
          "absolute -top-16 -right-16",
          "w-48 h-48",
          "rounded-full",
          // MUDANÇA 1: Reduz a opacidade no light mode para ser mais sutil
          "bg-linear-to-br from-red-400/30 to-red-800/30 dark:from-red-400/70 dark:to-red-800/70",
          "blur-3xl opacity-60",
          "pointer-events-none"
        )}
      />

      <div className="relative z-1 p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* MUDANÇA 2: Aumenta a opacidade do fundo do ícone e satura o ícone */}
            <div className="rounded-full bg-red-200 dark:bg-red-950/40 p-2.5">
              <HeartHandshake className="size-6 text-red-700 dark:text-red-400" />
            </div>
          </div>
        </div>

        {state.isLoading ? (
          <div className="space-y-1.5">
            <div className="h-7 w-20 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-3 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        ) : state.isError ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-red-500">Erro ao carregar</span>
            <span className="text-xs text-muted-foreground">Tente novamente</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {displayValue}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Pacientes
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className={cn("font-semibold", percentageColor)}>
                  {percentageText}
                </span>
                {' em relação ao mês anterior'}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}