import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'
import { PatientProfileCard } from '../patient-profile-card/patient-profile-card'
import { ProfileSectionHeader } from '../profile-section-header/profile-section-header'

import './patient-profile-section.css'

export function PatientProfileSection() {
  const navigate = useNavigate()
  const { profile: me } = useAuth()
  const { clearActivePracticeContextId } = useActivePracticeContextStore()

  const patientProfiles = me?.patientProfiles ?? []

  const handleEnterPatientProfile = useCallback(() => {
    clearActivePracticeContextId()
    navigate('/patient/dashboard')
  }, [clearActivePracticeContextId, navigate])

  if (patientProfiles.length === 0) return null

  return (
    <section className="w-full">
      <ProfileSectionHeader
        section="pacientes"
        title="Seus perfis de paciente"
        label="Escolha um perfil para acompanhar atendimentos, informações e evolução."
      />

      <div className="pf-cards-row">
        {patientProfiles.map((profile) => (
          <PatientProfileCard
            key={profile.id}
            profile={profile}
            onSelect={handleEnterPatientProfile}
          />
        ))}
      </div>
    </section>
  )
}
