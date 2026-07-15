import { NotepadText } from 'lucide-react'

import { DashboardStubSection } from '@/pages/app/dashboard/shared/components/dashboard-stub-section/dashboard-stub-section'

type IRecentJournalSection = {
  entries: unknown[]
}

export function RecentJournalSection({ entries }: IRecentJournalSection) {
  return (
    <DashboardStubSection
      className="flex-1"
      header={{
        icon: <NotepadText size={20} className="text-teal-500" />,
        title: 'Diário recente',
      }}
      state={{
        isEmpty: entries.length === 0,
        emptyText: 'Nenhuma entrada de diário ainda.',
      }}
    />
  )
}
