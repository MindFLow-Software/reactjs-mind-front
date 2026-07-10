import { NotepadText } from 'lucide-react'

import { Time } from '@/utils/time'

import type { IPatientJournalEntry } from '../types'

import { Separator } from '@/components/ui/separator'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

import './recent-journal-section.css'

export interface RecentJournalSectionProps {
  entries: IPatientJournalEntry[]
}

export function RecentJournalSection({ entries }: RecentJournalSectionProps) {
  if (entries.length === 0) {
    return (
      <Card className="ptd-journal-card">
        <CardHeader className="ptd-journal-header">
          <NotepadText size={20} className="ptd-journal-icon" />
          <CardTitle className="ptd-journal-title">Diário recente</CardTitle>
        </CardHeader>
        <p className="ptd-journal-empty-text">
          Nenhuma entrada de diário ainda.
        </p>
      </Card>
    )
  }

  return (
    <Card className="ptd-journal-card">
      <CardHeader className="ptd-journal-header">
        <NotepadText size={20} className="ptd-journal-icon" />
        <CardTitle className="ptd-journal-title">Diário recente</CardTitle>
      </CardHeader>

      <div className="ptd-journal-list">
        {entries.map((entry, index) => (
          <div key={entry.id} className="ptd-journal-entry">
            <div className="ptd-journal-entry-header">
              <span className="ptd-journal-entry-title">{entry.title}</span>
              <span className="ptd-journal-entry-date">
                {Time.toBrazilianFormat(new Date(entry.date))}
              </span>
            </div>
            <p className="ptd-journal-entry-excerpt">{entry.excerpt}</p>
            {index < entries.length - 1 && (
              <Separator className="ptd-journal-separator" />
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
