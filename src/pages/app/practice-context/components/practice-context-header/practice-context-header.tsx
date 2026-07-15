import './practice-context-header.css'

import { ActivePsychologistProfileBadge } from '@/pages/auth/components/active-psychologist-profile-badge/active-psychologist-profile-badge'

export function PracticeContextHeader() {
  return (
    <header className="pc-header">
      <p className="pc-eyebrow">Contexto de atuação</p>
      <h1 className="pc-title">Onde você pratica?</h1>
      <p className="pc-subtitle">
        Sua identidade profissional (CRP e credenciais) permanece a mesma em
        todos os seus espaços de trabalho. Escolha como deseja configurá-la —
        você pode adicionar mais informações a qualquer momento.
      </p>
      <div className="pc-identity-pill">
        <ActivePsychologistProfileBadge />
      </div>
    </header>
  )
}
