import { useApiMutation } from '@/hooks/use-api-mutation'
import { generateRegistrationLink } from '@/api/registration-link/generate-registration-link'
import type { IMutationResult } from '@/types/shared/mutation-result'

type IUseGenerateRegistrationLink = {
  isGenerating: boolean
  generateRegistrationLink: () => Promise<IMutationResult<void>>
}

export function useGenerateRegistrationLink(): IUseGenerateRegistrationLink {
  const { mutateAsync, isPending } = useApiMutation({
    mutationFn: generateRegistrationLink,
    successFallback: 'Link gerado com sucesso!',
    errorFallback: 'Falha ao gerar Link.',
    invalidateKeys: [['active-registration-link']],
  })

  return {
    isGenerating: isPending,
    generateRegistrationLink: mutateAsync,
  }
}
