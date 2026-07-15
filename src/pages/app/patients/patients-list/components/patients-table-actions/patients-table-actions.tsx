import './patients-table-actions.css'
import { Columns3, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function PatientsTableActions() {
  return (
    <>
      <Button
        disabled
        size="sm"
        type="button"
        variant="outline"
        className="pta-btn"
      >
        <Download className="size-3.5" />
        <span>Exportar</span>
      </Button>
      <Button
        disabled
        size="sm"
        type="button"
        variant="outline"
        className="pta-btn"
      >
        <Columns3 className="size-3.5" />
        <span>Colunas</span>
      </Button>
    </>
  )
}
