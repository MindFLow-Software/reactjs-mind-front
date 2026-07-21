import { useAuth } from '@/hooks/use-auth'
import { ShieldCheck } from 'lucide-react'

import { fn } from '@/utils/fn'
import { Honorific } from '@/types/shared/enums'

export function ActivePsychologistProfileBadge() {
  const { profile } = useAuth()

  const translatedHonorific = fn.one(
    profile?.psychologistProfile?.honorific,
    {
      [Honorific.MASC_DR]: 'Dr.',
      [Honorific.FEMININE_DR]: 'Dra.',
      [Honorific.MSC]: 'MSc.',
      [Honorific.PHD]: 'PhD',
    },
    'Dr.',
  )

  const fullName = `${profile?.firstName} ${profile?.lastName}`
  const crp = profile?.psychologistProfile?.crp

  return (
    <div className="flex items-center gap-2 my-4 w-fit rounded-lg border border-border bg-card px-12 py-1 shadow-sm">
      <ShieldCheck size={14} className="text-success" />
      <p className="text-xs">
        <span className="text-muted-foreground">Utilizando Perfil</span> ·{' '}
        <span className="font-medium">
          {translatedHonorific} {fullName}
        </span>{' '}
        · <span className="text-muted-foreground">CRP {crp}</span>
      </p>
    </div>
  )
}
