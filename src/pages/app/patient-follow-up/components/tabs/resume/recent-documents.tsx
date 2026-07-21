import { TitleIcon } from '@/components/title-icon/title-icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileCheck, FileText } from 'lucide-react'

import { RECENT_DOCUMENTS } from './resume-data'
import './recent-documents.css'

export function RecentDocuments() {
  return (
    <Card className="rd-card">
      <CardHeader className="rd-header">
        <TitleIcon>
          <FileText size={18} />
        </TitleIcon>
        <CardTitle>Documentos recentes</CardTitle>
      </CardHeader>
      <CardContent className="rd-content">
        {RECENT_DOCUMENTS.map((document) => (
          <Card key={document.id} className="rd-item-card">
            <CardContent className="rd-item-content">
              <div className="rd-item-info">
                <div className="rd-item-icon-wrap">
                  <FileCheck size={16} className="text-green-500" />
                </div>
                <div className="rd-item-text">
                  <CardTitle className="text-xs">{document.title}</CardTitle>
                  <CardDescription className="text-[11px]">{document.type} · {document.date}</CardDescription>
                </div>
              </div>
              <Button size="icon" variant="ghost">
                <Download size={16} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
