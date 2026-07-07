import { useApiMutation } from '@/hooks/use-api-mutation'
import { cancelAppointment } from '@/api/appointments/cancel-appointment'

export function useCancelAppointment() {
  return useApiMutation({
    mutationFn: cancelAppointment,
    successFallback: 'Agendamento cancelado!',
    errorFallback: 'Não foi possível cancelar o agendamento.',
    invalidateKeys: [['appointments']],
  })
}
