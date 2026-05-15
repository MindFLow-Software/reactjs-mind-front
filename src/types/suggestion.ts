export const SuggestionCategory = {
  UI_UX:        'UI_UX',
  SCHEDULING:   'SCHEDULING',
  REPORTS:      'REPORTS',
  PRIVACY_LGPD: 'PRIVACY_LGPD',
  INTEGRATIONS: 'INTEGRATIONS',
  OTHERS:       'OTHERS',
} as const
export type SuggestionCategory = (typeof SuggestionCategory)[keyof typeof SuggestionCategory]

export const SuggestionStatus = {
  PENDING:      'PENDING',
  OPEN:         'OPEN',
  UNDER_REVIEW: 'UNDER_REVIEW',
  PLANNED:      'PLANNED',
  IMPLEMENTED:  'IMPLEMENTED',
  REJECTED:     'REJECTED',
} as const
export type SuggestionStatus = (typeof SuggestionStatus)[keyof typeof SuggestionStatus]

export interface SuggestionHTTP {
  id:               string
  psychologistId:   string
  psychologistName: string | null
  title:            string
  description:      string
  category:         SuggestionCategory
  status:           SuggestionStatus
  likes:            string[]
  attachments:      string[]
  createdAt:        string
  updatedAt:        string
}
