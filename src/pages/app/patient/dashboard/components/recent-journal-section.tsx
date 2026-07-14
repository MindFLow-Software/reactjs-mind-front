import { NotepadText } from 'lucide-react'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'

import './recent-journal-section.css'

export interface RecentJournalSectionProps {
  entries: unknown[]
}

export function RecentJournalSection({ entries }: RecentJournalSectionProps) {
  return (
    <Card className="ptd-journal-card">
      <CardHeader className="ptd-journal-header">
        <NotepadText size={20} className="ptd-journal-icon" />
        <CardTitle className="ptd-journal-title">Diário recente</CardTitle>
      </CardHeader>
      {entries.length === 0 && (
        <p className="ptd-journal-empty-text">
          Nenhuma entrada de diário ainda.
        </p>
      )}
    </Card>
  )
}
