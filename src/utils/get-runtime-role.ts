import type { IMeResponse } from '@/types/me/me-response'

export type RuntimeRole = 'BOTH' | 'PSYCHOLOGIST' | 'PATIENT' | 'NEW_USER'

export function getRuntimeRole(
  state: IMeResponse | null | undefined,
): RuntimeRole {
  if (!state) return 'NEW_USER'

  const isPsychologist = state.psychologistProfile !== null
  const isPatient = state.patientProfiles.length > 0

  if (isPsychologist && isPatient) return 'BOTH'
  if (isPsychologist) return 'PSYCHOLOGIST'
  if (isPatient) return 'PATIENT'
  return 'NEW_USER'
}
