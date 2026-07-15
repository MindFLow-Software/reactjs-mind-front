import { Goal } from 'lucide-react'

import { DashboardStubSection } from '@/pages/app/dashboard/shared/components/dashboard-stub-section/dashboard-stub-section'

type ITherapeuticGoalsSection = {
  goals: unknown[]
}

export function TherapeuticGoalsSection({ goals }: ITherapeuticGoalsSection) {
  return (
    <DashboardStubSection
      className="w-full max-w-1/3"
      header={{
        icon: <Goal size={20} className="text-teal-500" />,
        title: 'Metas terapêuticas',
      }}
      state={{
        isEmpty: goals.length === 0,
        emptyText: 'Nenhuma meta definida ainda.',
      }}
    />
  )
}
