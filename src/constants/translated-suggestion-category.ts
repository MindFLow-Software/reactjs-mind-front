import { SuggestionCategory } from '@/types/enums'

export const translatedSuggestionCategory: Record<SuggestionCategory, string> =
  {
    [SuggestionCategory.UI_UX]: 'Interface / UX',
    [SuggestionCategory.SCHEDULING]: 'Agendamentos',
    [SuggestionCategory.REPORTS]: 'Relatórios',
    [SuggestionCategory.PRIVACY_LGPD]: 'Privacidade',
    [SuggestionCategory.INTEGRATIONS]: 'Integrações',
    [SuggestionCategory.OTHERS]: 'Outros',
  }
