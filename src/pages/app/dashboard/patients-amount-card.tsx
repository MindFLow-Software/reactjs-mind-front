import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HeartHandshake } from 'lucide-react'
import { getAmountPatientsCard } from '@/api/get-amount-patients-card'

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
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          Total Pacientes
          <HeartHandshake className="size-6 text-red-600 dark:text-red-500" />
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-1">
        {state.isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-24 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        ) : state.isError ? (
          <span className="text-sm text-red-500">Erro ao carregar</span>
        ) : (
          <span className="text-2xl font-bold tracking-tight">{displayValue}</span>
        )}

        {!state.isLoading && !state.isError && (
          <p className="text-xs text-muted-foreground">
            <span className={percentageColor}>{percentageText}</span>{' '}
            em relação ao mês anterior
          </p>
        )}
      </CardContent>
    </Card>
  )
}
