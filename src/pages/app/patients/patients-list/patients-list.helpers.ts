type PatientStatus = 'ACTIVE' | 'REJECTED' | 'PENDING' | 'BLOCKED'

export function formatPatientsShowing(showing: number, total: number): string {
  return `Mostrando ${showing} de ${total} pacientes`
}

export function calcTotalPatients(perPage: number, total: number): number {
  return total > 0 ? Math.min(perPage, total) : 0
}

export function hasActiveFilters(
  filter: string,
  status: PatientStatus | null,
): boolean {
  return filter.length > 0 || status !== null
}
