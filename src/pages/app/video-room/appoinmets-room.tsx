'use client'

import { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'

import { AppointmentAddForm } from './components/appointment-add-form'
import { SessionTimer } from './components/SessionTimer'
import { useHeaderStore } from '@/store/use-header-store'
import { SessionNotesEditor } from './components/session-notes-editor'

export function AppointmentsRoom() {
  const { setTitle } = useHeaderStore()

  const [selectedAppointmentId, setSelectedAppointmentId] = useState('')
  const [content, setNotes] = useState('')
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  useEffect(() => {
    setTitle('Sala de Atendimento')
  }, [setTitle])

  const handleSessionStarted = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId)
    setIsSessionActive(true)
  }, [])

  const handleSessionFinished = useCallback(() => {
    setIsSessionActive(false)
    setCurrentSessionId(null)
    setSelectedAppointmentId('')
    setNotes('')
  }, [])

  return (
    <>
      <Helmet title="Sala de Atendimento" />

      <div className="flex flex-col gap-4 mt-6">
        <div className="flex justify-center">
          <SessionTimer isActive={isSessionActive} />
        </div>

        <SessionNotesEditor
          content={content}
          isSessionActive={isSessionActive}
          onContentChange={setNotes}
          maxLength={8000}
        />

        <AppointmentAddForm
          session={{
            currentAppointmentId: selectedAppointmentId,
            currentSessionId,
            isSessionActive,
            content,
          }}
          handlers={{
            onSelectPatient: setSelectedAppointmentId,
            onSessionStarted: handleSessionStarted,
            onSessionFinished: handleSessionFinished,
          }}
        />
      </div>
    </>
  )
}
