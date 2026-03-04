"use client"

import { useState, useCallback, useEffect } from "react"
import { Helmet } from "react-helmet-async"

import { AppointmentAddForm } from "./components/appointment-add-form"
import { SessionTimer } from "./components/SessionTimer"
import { useHeaderStore } from "@/hooks/use-header-store"
import { SessionNotesEditor } from "./components/session-notes-editor"
import { useLocation, useNavigate } from "react-router-dom"

export function AppointmentsRoom() {
    const { setTitle } = useHeaderStore()

    const location = useLocation()
    const navigate = useNavigate()

    const [selectedAppointmentId, setSelectedAppointmentId] = useState("")
    const [content, setNotes] = useState("")
    const [isSessionActive, setIsSessionActive] = useState(false)
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

    useEffect(() => {
        setTitle("Sala de Atendimento")
    }, [setTitle])

    useEffect(() => {
        const state = location.state as { appointmentId?: string } | null
        const appointmentId = state?.appointmentId
        if (appointmentId) {
            setSelectedAppointmentId(appointmentId)
            navigate(location.pathname, { replace: true, state: undefined })
        }
    }, [location.pathname, location.state, navigate])

    const handleSessionStarted = useCallback((sessionId: string) => {
        setCurrentSessionId(sessionId)
        setIsSessionActive(true)
    }, [])

    const handleSessionFinished = useCallback(() => {
        setIsSessionActive(false)
        setCurrentSessionId(null)
        setSelectedAppointmentId("")
        setNotes("")
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
                    onSelectPatient={setSelectedAppointmentId}
                    currentAppointmentId={selectedAppointmentId}
                    currentSessionId={currentSessionId}
                    onSessionStarted={handleSessionStarted}
                    onSessionFinished={handleSessionFinished}
                    isSessionActive={isSessionActive}
                    content={content}
                />
            </div>
        </>
    )
}
