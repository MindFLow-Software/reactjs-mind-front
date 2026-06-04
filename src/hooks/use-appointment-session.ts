import { useState, useCallback } from 'react'

export function useAppointmentSession() {
  const [selectedPatientId, setSelectedPatientId] = useState('')
  const [notes, setNotes] = useState('')
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const handleSessionStarted = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId)
    setIsSessionActive(true)
  }, [])

  const handleSessionFinished = useCallback(() => {
    setIsSessionActive(false)
    setCurrentSessionId(null)
    setSelectedPatientId('')
    setNotes('')
  }, [])

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const MAX_LENGTH = 8000
      setNotes(e.target.value.substring(0, MAX_LENGTH))
    },
    [],
  )

  return {
    selectedPatientId,
    setSelectedPatientId,
    notes,
    setNotes,
    handleNotesChange,
    isSessionActive,
    currentSessionId,
    handleSessionStarted,
    handleSessionFinished,
  }
}
