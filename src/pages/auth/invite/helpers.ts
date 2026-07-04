import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatInviteExpiresAt(expiresAt: string) {
  return format(new Date(expiresAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
    locale: ptBR,
  })
}
