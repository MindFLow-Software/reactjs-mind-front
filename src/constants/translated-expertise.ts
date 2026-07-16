import { Expertise } from '@/types/shared/enums'

export const translatedExpertise: Record<Expertise, string> = {
  [Expertise.OTHER]: 'Outro',
  [Expertise.SOCIAL]: 'Social',
  [Expertise.INFANT]: 'Infantil',
  [Expertise.CLINICAL]: 'Clinico',
  [Expertise.JURIDICAL]: 'Jurídico',
  [Expertise.EDUCATIONAL]: 'Educacional',
  [Expertise.ORGANIZATIONAL]: 'Organizacional',
  [Expertise.PSYCHOTHERAPIST]: 'Psicoterapia',
  [Expertise.NEUROPSYCHOLOGY]: 'NeuroPsicologia',
}
