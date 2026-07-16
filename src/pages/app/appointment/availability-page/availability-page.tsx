import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { CalendarClock, Info, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { getAvailability } from '@/api/availability/get-availability'
import { useHeaderStore } from '@/store/use-header-store'

import { ScheduleManager } from './components/schedule-manager/schedule-manager'

import './availability-page.css'

export function AvailabilityPage() {
  const { setTitle } = useHeaderStore()

  const {
    data: initialData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['availability'],
    queryFn: getAvailability,
  })

  useEffect(() => {
    setTitle('Horários de Atendimento')
  }, [setTitle])

  useEffect(() => {
    if (isError) toast.error('Não foi possível carregar sua agenda atual.')
  }, [isError])

  return (
    <>
      <Helmet title="Horários de Atendimento" />

      <div className="avp-root">
        <header className="avp-header">
          <div className="avp-header-row">
            <CalendarClock className="avp-header-icon" />
            <h1 className="avp-header-title">Minha Agenda de Atendimento</h1>
          </div>
          <p className="avp-header-subtitle">
            Configure os horários recorrentes em que você estará disponível para
            novos agendamentos.
          </p>
        </header>

        <div className="avp-info">
          <Info className="avp-info-icon" />
          <div className="avp-info-body">
            <p className="avp-info-title">Como funciona?</p>
            <p className="avp-info-text">
              Os horários definidos aqui serão usados para gerar os slots
              disponíveis para seus pacientes. Se você tiver um agendamento já
              marcado, aquele horário será removido automaticamente da lista de
              seleção do paciente.
            </p>
          </div>
        </div>

        <div className="avp-divider" />

        {isLoading ? (
          <div className="avp-loading">
            <Loader2 className="avp-loading-icon" />
            <p className="avp-loading-text">Carregando sua agenda...</p>
          </div>
        ) : (
          <div className="avp-content">
            <ScheduleManager defaultData={initialData ?? []} />
          </div>
        )}
      </div>
    </>
  )
}
