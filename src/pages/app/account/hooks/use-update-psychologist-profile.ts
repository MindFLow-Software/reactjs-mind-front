import { useApiMutation } from '@/hooks/use-api-mutation'
import { updatePsychologistProfile } from '@/api/psychologists/update-psychologist-profile'

export function useUpdatePsychologistProfile() {
  return useApiMutation({
    mutationFn: updatePsychologistProfile,
    successFallback: 'Perfil atualizado!',
    errorFallback: 'Erro ao atualizar perfil.',
    invalidateKeys: [['psychologist-profile']],
  })
}
