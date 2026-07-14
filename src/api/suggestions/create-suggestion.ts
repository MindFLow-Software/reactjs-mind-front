import { api } from '@/lib/axios'
import type { IMutationResult } from '@/types/shared/mutation-result'

interface CreateSuggestionRequest {
  title: string
  description: string
  category: string
  files?: File[]
}

export async function createSuggestion({
  title,
  description,
  category,
  files,
}: CreateSuggestionRequest): Promise<IMutationResult<void>> {
  const formData = new FormData()

  formData.append('title', title)
  formData.append('description', description)
  formData.append('category', category)

  if (files) {
    files.forEach((file) => {
      formData.append('files', file)
    })
  }

  const response = await api.post('/suggestions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return { data: undefined, message: response.apiMessage ?? null }
}
