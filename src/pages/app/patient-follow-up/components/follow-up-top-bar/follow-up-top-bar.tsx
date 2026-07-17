import { MoveLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { PatientNavigationControls } from '../../../patients/patients-records/components/patient-navigation-controls/patient-navigation-controls'

import './follow-up-top-bar.css'

type FollowUpTopBarProps = {
  queue: {
    prevId: string | null
    nextId: string | null
    currentIndex: number
    total: number
  }
}

export function FollowUpTopBar({ queue }: FollowUpTopBarProps) {
  const navigate = useNavigate()

  const showNavigation = queue.total > 1 && queue.currentIndex >= 0

  return (
    <div className="pfu-top-bar">
      <button onClick={() => navigate(-1)} className="group pfu-back-btn">
        <MoveLeft className="pfu-back-icon" />
        <span className="pfu-back-label">
          Voltar para listagem de pacientes
        </span>
      </button>

      {showNavigation && (
        <PatientNavigationControls
          queue={{
            prevId: queue.prevId,
            nextId: queue.nextId,
            current: queue.currentIndex + 1,
            total: queue.total,
          }}
        />
      )}
    </div>
  )
}
