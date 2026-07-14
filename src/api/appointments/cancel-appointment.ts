import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'

export async function cancelAppointment(
  appointmentId: string,
): Promise<IMutationResult<void>> {
  if (!appointmentId || appointmentId === 'undefined') {
    throw new Error('ID do agendamento é obrigatório para o cancelamento.')
  }

  const response = await api.patch(`/appointments/${appointmentId}/cancel`)

  return { data: response.data, message: response.apiMessage ?? null }
}
