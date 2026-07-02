import { useApiMutation } from '@/hooks/use-api-mutation'
import { updateAppointment } from '@/api/appointments/update-appointment'

export function useUpdateAppointment() {
  return useApiMutation({
    mutationFn: updateAppointment,
    successFallback: 'Agendamento atualizado!',
    errorFallback: 'Não foi possível atualizar o agendamento.',
    invalidateKeys: [['appointments']],
  })
}
