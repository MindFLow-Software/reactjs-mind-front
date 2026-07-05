import { Clock } from 'lucide-react'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import './patient-dashboard.css'

export function PatientDashboard() {
  return (
    <div className="pd-root">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock />
          </EmptyMedia>
          <EmptyTitle>Painel do paciente</EmptyTitle>
          <EmptyDescription>
            Em breve. Esta área está em construção.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
