import { useNavigate } from 'react-router-dom'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import { createPsychologistProfile } from '@/api/auth/create-psychologist-profile'
import type { CreatePsychologistProfileData } from '@/validators/psychologists/form/create-psychologist-profile-schema'
import { useFormData } from '@/hooks/use-form-data'

type IUseCreatePsychologistProfileReturn = {
  createPsychologistProfileFn: (data: CreatePsychologistProfileData) => Promise<void>
  isCreatingPsychologistProfile: boolean
}

export function useCreatePsychologistProfile(): IUseCreatePsychologistProfileReturn {
  const navigate = useNavigate()
  const { transform } = useFormData<CreatePsychologistProfileData>()

  const { mutateAsync, isPending: isCreatingPsychologistProfile } = useApiMutation({
    mutationFn: createPsychologistProfile,
    successFallback: 'Perfil profissional criado.',
    errorFallback: 'Não foi possível criar o perfil profissional.',
    invalidateKeys: [queryKeys.me],
    onSuccess: () => {
      navigate('/profiles/context')
    },
  })

  async function createPsychologistProfileFn(data: CreatePsychologistProfileData) {
    await mutateAsync(transform(data))
  }

  return {
    createPsychologistProfileFn,
    isCreatingPsychologistProfile,
  }
}
