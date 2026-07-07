import { useNavigate } from 'react-router-dom'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import { createPsychologistProfile } from '@/api/auth/create-psychologist-profile'

export function useCreatePsychologistProfile() {
  const navigate = useNavigate()

  return useApiMutation({
    mutationFn: createPsychologistProfile,
    successFallback: 'Perfil profissional criado.',
    errorFallback: 'Não foi possível criar o perfil profissional.',
    invalidateKeys: [queryKeys.me],
    onSuccess: () => {
      navigate('/profiles/context')
    },
  })
}
