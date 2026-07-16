import type { SuggestionCategory } from '@/types/suggestion/suggestion-category'
import type { SuggestionStatus } from '@/types/suggestion/suggestion-status'

export type ISuggestion = {
  id: string
  psychologistProfileId: string
  psychologistName: string | null
  title: string
  description: string
  category: SuggestionCategory
  status: SuggestionStatus
  likes: string[]
  likesCount: number
  attachments: string[]
  createdAt: string
  updatedAt: string
}
