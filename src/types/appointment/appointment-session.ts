export type IAppointmentSession = {
  id: string
  appointmentId: string
  startedAt: string
  endedAt: string | null
  durationInMin: number | null
  meetingLink: string | null
  notes: string | null
}
