import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import './patient-navigation-controls.css'

interface PatientNavigationControlsProps {
  prevId: string | null
  nextId: string | null
  current: number
  total: number
}

export function PatientNavigationControls({
  prevId,
  nextId,
  current,
  total,
}: PatientNavigationControlsProps) {
  const navigate = useNavigate()

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
