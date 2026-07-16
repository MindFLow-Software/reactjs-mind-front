export type ISessionParticipant = {
  participantType: 'PSYCHOLOGIST' | 'PATIENT' | null
  psychologistPracticeContextId: string | null
  patientProfileId: string | null
  joinedAt: string
  leftAt: string | null
}
