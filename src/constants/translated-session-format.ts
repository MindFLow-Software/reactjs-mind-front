import { SessionFormat } from '@/types/psychologist/session-format'

export const translatedSessionFormat: Record<SessionFormat, string> = {
  [SessionFormat.ONLINE]: 'Online',
  [SessionFormat.HYBRID]: 'Híbrido',
  [SessionFormat.IN_PERSON]: 'Presencial',
}
