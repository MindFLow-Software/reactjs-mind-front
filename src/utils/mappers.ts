// Single caller (psychologist-profile-card.tsx) — kept local per T26 review, not class-ified.
export const ROLE_TRANSLATIONS: Record<string, string> = {
  USER: 'Usuário',
  SUPPORT: 'Suporte',
  ADMIN: 'Administrador',
}

// Single caller (session-history-table.tsx) — kept local per T26 review, not class-ified.
export const SESSION_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  SCHEDULED: { label: 'Agendado', color: 'text-blue-500' },
  ATTENDING: { label: 'Em andamento', color: 'text-amber-500' },
  FINISHED: { label: 'Concluída', color: 'text-emerald-600' },
  DONE: { label: 'Concluída', color: 'text-emerald-600' },
  CONCLUÍDA: { label: 'Concluída', color: 'text-emerald-600' },
  CANCELED: { label: 'Cancelado', color: 'text-red-500' },
  NOT_ATTEND: { label: 'Não compareceu', color: 'text-orange-500' },
  RESCHEDULED: { label: 'Remarcado', color: 'text-purple-500' },
}

export function getSessionStatusLabel(status: string): {
  label: string
  color: string
} {
  return (
    SESSION_STATUS_MAP[status?.toUpperCase()] ?? {
      label: status || 'N/A',
      color: 'text-muted-foreground',
    }
  )
}

export const FINISHED_SESSION_STATUSES = [
  'FINISHED',
  'DONE',
  'CONCLUÍDA',
  'CONCLUIDO',
] as const
