import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import './patient-navigation-controls.css'

type IPatientNavigationControlsQueue = {
  prevId: string | null
  nextId: string | null
  current: number
  total: number
}

type IPatientNavigationControls = {
  queue: IPatientNavigationControlsQueue
}

export function PatientNavigationControls({
  queue,
}: IPatientNavigationControls) {
  const navigate = useNavigate()
  const { prevId, nextId, current, total } = queue

  return (
    <div className="pr-nav-root">
      <Button
        variant="outline"
        size="icon"
        className="pr-nav-btn"
        disabled={!prevId}
        onClick={() => navigate(`/patients/${prevId}/details`)}
        aria-label="Paciente anterior"
      >
        <ChevronLeft className="size-4.5" />
      </Button>

      <span className="pr-nav-label">
        Paciente {current} de {total}
      </span>

      <Button
        variant="outline"
        size="icon"
        className="pr-nav-btn"
        disabled={!nextId}
        onClick={() => navigate(`/patients/${nextId}/details`)}
        aria-label="Próximo paciente"
      >
        <ChevronRight className="size-4.5" />
      </Button>
    </div>
  )
}
