import { useApiMutation } from '@/hooks/use-api-mutation'
import { rescheduleAppointment } from '@/api/appointments/reschedule-appointment'

export function useRescheduleAppointment() {
  return useApiMutation({
    mutationFn: rescheduleAppointment,
    successFallback: 'Agendamento remarcado!',
    errorFallback: 'Não foi possível remarcar o agendamento.',
    invalidateKeys: [['appointments']],
  })
}
