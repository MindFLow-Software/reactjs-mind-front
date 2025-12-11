import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { HeartHandshake } from 'lucide-react'
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
  const [state, setState] = useState({
    total: null as number | null,
    isLoading: true,
    isError: false
  })

  useEffect(() => {
    fetchPatientTotal()
      .then(data =>
        setState({ total: data.total, isLoading: false, isError: false })
      )
      .catch(() =>
        setState(prev => ({ ...prev, isLoading: false, isError: true }))
      )
  }, [])

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 border-b-[3px] border-b-blue-700 dark:border-b-blue-500",
        "shadow-md shadow-black/20 dark:shadow-black/8 bg-card transition-all p-4"
      )}
    >
      <div
        className={cn(
          "absolute -top-14 -right-14 w-40 h-40 rounded-full",
          "bg-linear-to-r from-blue-400/50 to-blue-700/30 dark:from-blue-400/70 dark:to-blue-900",
          "blur-3xl opacity-60 pointer-events-none"
        )}
      />

      <img
        src={'/iconCountcard.svg'}
        alt="Ícone decorativo"
        className={cn(
          "absolute bottom-0 right-0",
          "w-3xl h-auto max-w-[150px]",
          "opacity-70",
          "pointer-events-none",
          "translate-x-1/4 translate-y-1/4"
        )}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="rounded-full bg-blue-100/80 dark:bg-blue-950/40 p-2 w-fit">
          <HeartHandshake className="size-5 text-blue-700 dark:text-blue-400" />
        </div>

        {state.isLoading ? (
          <div className="space-y-2">
            <div className="h-6 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        ) : state.isError ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-blue-500">Erro ao carregar</span>
            <span className="text-xs text-muted-foreground">Tente novamente</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-semibold tracking-tight leading-none">
              {state.total !== null ? state.total.toLocaleString("pt-BR") : '—'}
            </span>
            
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Total de Pacientes
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}