import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { PatientProfileCard } from './patient-profile-card'
import { ProfileSectionHeader } from './profile-section-header'

export function PatientProfileSection() {
  const navigate = useNavigate()
  const { profile: me } = useAuth()

  const patientProfiles = me?.patientProfiles ?? []

  const handleEnterPatientProfile = useCallback(
    (_id: string) => {
      navigate('/patient-dashboard')
    },
    [navigate],
  )

  if (patientProfiles.length === 0) return null

  return (
    <section className="w-full">
      <ProfileSectionHeader
        section="Pacientes"
        title="Seus perfis de paciente"
        label="Escolha um perfil para acompanhar atendimentos, informações e evolução."
      />

      <div className="flex gap-4">
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
