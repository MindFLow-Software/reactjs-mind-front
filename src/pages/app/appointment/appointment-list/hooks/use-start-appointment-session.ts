import { useApiMutation } from '@/hooks/use-api-mutation'
import { startAppointmentSession } from '@/api/appointments/start-appointment-session'

export function useStartAppointmentSession() {
  return useApiMutation({
    mutationFn: startAppointmentSession,
    successFallback: 'Sessão iniciada!',
    errorFallback: 'Não foi possível iniciar a sessão.',
    invalidateKeys: [['appointments']],
  })
}
