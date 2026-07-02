import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PatientNavigationControls } from '../../patients-records/components/patient-navigation-controls'

interface HubTopBarProps {
  queue: {
    prevId: string | null
    nextId: string | null
    currentIndex: number
    total: number
  }
}

export function HubTopBar({ queue }: HubTopBarProps) {
  const navigate = useNavigate()

  const showNavigation = queue.total > 1 && queue.currentIndex >= 0

  return (
    <div className="phd-top-bar">
      <button onClick={() => navigate(-1)} className="group phd-back-btn">
        <MoveLeft className="phd-back-icon" />
        <span className="phd-back-label">
          Voltar para listagem de pacientes
        </span>
      </button>

      {showNavigation && (
        <PatientNavigationControls
          prevId={queue.prevId}
          nextId={queue.nextId}
          current={queue.currentIndex + 1}
          total={queue.total}
        />
      )}
    </div>
  )
}
