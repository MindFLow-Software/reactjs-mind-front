import { ShieldCheck } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { translatedHonorific } from '@/constants/translated-honorific'

import './active-psychologist-profile-badge.css'

export function ActivePsychologistProfileBadge() {
  const { profile } = useAuth()

  const honorific = profile?.psychologistProfile?.honorific
  const fullName = `${profile?.firstName} ${profile?.lastName}`
  const crp = profile?.psychologistProfile?.crp

  return (
    <div className="apb-root">
      <ShieldCheck size={14} className="text-success" />
      <p className="apb-text">
        <span className="text-muted-foreground">Utilizando Perfil</span> ·{' '}
        <span className="font-medium">
          {honorific && translatedHonorific[honorific]} {fullName}
        </span>{' '}
        · <span className="text-muted-foreground">CRP {crp}</span>
      </p>
    </div>
  )
}
