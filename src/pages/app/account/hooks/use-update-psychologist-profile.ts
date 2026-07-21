import { useApiMutation } from '@/hooks/use-api-mutation'
import { updatePsychologistProfile } from '@/api/psychologists/update-psychologist-profile'
import type { UpdatePsychologistData } from '@/validators/psychologists/form/update-psychologist-schema'
import { useFormData } from '@/hooks/use-form-data'

type IUseUpdatePsychologistProfileReturn = {
  updateProfileFn(data: UpdatePsychologistData): Promise<void>
  isUpdatingPsychologistProfile: boolean
}

export function useUpdatePsychologistProfile(): IUseUpdatePsychologistProfileReturn {
  const { transform } = useFormData<UpdatePsychologistData>()

  const { mutateAsync, isPending: isUpdatingPsychologistProfile } =
    useApiMutation({
      mutationFn: updatePsychologistProfile,
      successFallback: 'Perfil atualizado!',
      errorFallback: 'Erro ao atualizar perfil.',
      invalidateKeys: [['profile', 'psychologist-profile']],
    })

  async function updateProfileFn(data: UpdatePsychologistData) {
    await mutateAsync(transform(data))
  }

  return {
    updateProfileFn,
    isUpdatingPsychologistProfile,
  }
}
