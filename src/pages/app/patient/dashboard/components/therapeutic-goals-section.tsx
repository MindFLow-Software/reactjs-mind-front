import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import './therapeutic-goals-section.css'
import { Goal } from 'lucide-react'

export interface TherapeuticGoalsSectionProps {
  goals: unknown[]
}

export function TherapeuticGoalsSection({
  goals,
}: TherapeuticGoalsSectionProps) {
  return (
    <Card className="ptd-goals-card">
      <CardHeader className="ptd-goals-header">
        <Goal size={20} className="text-teal-500" />
        <CardTitle className="ptd-goals-title">Metas terapêuticas</CardTitle>
      </CardHeader>

      {goals.length === 0 && (
        <p className="ptd-goals-empty-text">Nenhuma meta definida ainda.</p>
      )}
    </Card>
  )
}
