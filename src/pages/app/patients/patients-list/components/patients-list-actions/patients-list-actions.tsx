import './patients-list-actions.css'
import { QrCode, Upload, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type IPatientsListActions = {
  onInvite: () => void
  onRegister: () => void
}

export function PatientsListActions({
  onInvite,
  onRegister,
}: IPatientsListActions) {
  return (
    <div className="pla-root">
      <Button
        disabled
        type="button"
        variant="outline"
        className="pla-action-btn"
      >
        <Upload className="size-4" />
        Importar
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onInvite}
        className="pla-action-btn"
      >
        <QrCode className="size-4" />
        <span>Link de auto-cadastro</span>
      </Button>
      <Button type="button" className="pla-primary-btn" onClick={onRegister}>
        <UserRoundPlus className="size-4" />
        <span>Cadastrar paciente</span>
      </Button>
    </div>
  )
}
