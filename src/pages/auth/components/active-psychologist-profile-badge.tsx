import { Honorific } from '@/types/psychologist'
import { ShieldCheck } from 'lucide-react'

type IactivePsychologistProfileBadge = {
  crp: string
  name: string
  honorific: Honorific
}

export function ActivePsychologistProfileBadge({
  crp,
  name,
  honorific,
}: IactivePsychologistProfileBadge) {
  const translatedHonorific = {
    [Honorific.MASC_DR]: 'Dr.',
    [Honorific.FEMININE_DR]: 'Dra.',
    [Honorific.MSC]: 'MSc.',
    [Honorific.PHD]: 'PhD',
  }

  return (
    <div className="flex items-center gap-2 my-4 rounded-lg bg-white w-fit px-12 py-1">
      <ShieldCheck size={14} className="text-green-600" />
      <p className="text-xs">
        <span className="text-muted-foreground">Utilizando Perfil</span> ·{' '}
        <span className="font-medium">
          {translatedHonorific[honorific]} {name}
        </span>{' '}
        · <span className="text-muted-foreground">CRP {crp}</span>
      </p>
    </div>
  )
}
