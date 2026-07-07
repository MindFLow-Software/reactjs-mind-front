import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { registerAppointment } from '@/api/appointments/create-appointment'

export interface UseRegisterAppointmentOptions {
  onSuccess?: () => void
}

export function useRegisterAppointment({
  onSuccess,
}: UseRegisterAppointmentOptions) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerAppointment,
    onSuccess: () => {
      toast.success('Agendamento criado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      onSuccess?.()
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status
        const message = error.message

        if (status === 409) {
          return toast.error('Conflito de Horário', {
            description:
              message || 'Você já possui um agendamento para este horário.',
          })
        }

        if (status === 400) {
          if (message?.toLowerCase().includes('inativo')) {
            return toast.error('Paciente Inativo', {
              description: message,
            })
          }
          return toast.error('Dados Inválidos', {
            description:
              message || 'Verifique as informações ou a data selecionada.',
          })
        }

        if (status === 404) {
          return toast.error('Não encontrado', {
            description: message || 'Paciente não localizado.',
          })
        }
      }

      toast.error('Erro ao criar agendamento.')
    },
  })
}
