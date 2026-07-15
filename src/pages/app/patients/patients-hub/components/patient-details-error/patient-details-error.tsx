import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

import './patient-details-error.css'

interface PatientDetailsErrorProps {
  onRetry: () => void
}

export function PatientDetailsError({ onRetry }: PatientDetailsErrorProps) {
  return (
    <div className="phd-error">
      <AlertCircle className="phd-error-icon" />
      <div className="text-center">
        <p className="phd-error-title">
          Erro ao carregar detalhes do paciente.
        </p>
        <p className="phd-error-subtitle">
          Verifique a conexao ou o ID informado.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  )
}
