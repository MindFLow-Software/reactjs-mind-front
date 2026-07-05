import type { SuggestionCategory, SuggestionStatus } from '@/types/enums'

export interface ISuggestion {
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
