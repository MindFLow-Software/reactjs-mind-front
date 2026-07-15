'use client'

import type { ReactElement } from 'react'
import { Download, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { usePdfExport } from '../../hooks/use-pdf-export'
import type { ISessionItem } from '@/types/patient/session-item'

import { Normalizer } from '@/utils/normalizer'

interface ExportButtonProps {
  session: ISessionItem
  patientName: string
  document: ReactElement
}

export function ExportPDFButton({
  session,
  patientName,
  document,
}: ExportButtonProps) {
  const filename = `Evolucao-${Normalizer.toSnakeCase(patientName)}-${session.id.substring(0, 5)}.pdf`
  const { isExporting, exportToPdf } = usePdfExport({
    receivedFilename: filename,
  })

  const handleDownload = async () => {
    await exportToPdf(document)
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isExporting || !session.content}
      variant="outline"
      size="sm"
      className="gap-2 cursor-pointer"
    >
      {isExporting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      {isExporting ? 'Gerando...' : 'Baixar PDF'}
    </Button>
  )
}
