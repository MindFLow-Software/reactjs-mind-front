import './evolution-viewer.css'
import { useCallback, useState } from 'react'
import { Download, FileText, ArrowLeft, Loader2 } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SessionPDFTemplate } from '@/templates/pdf/session-pdf-template'
import { Files } from '@/utils/files'
import { Time } from '@/utils/time'
import type { IEvolutionRecord } from '../../../patients-list.types'

type IEvolutionViewer = {
  record: IEvolutionRecord
  psychologist: { name: string; crp: string }
  onBack: () => void
}

const EMPTY_DATE = '--/--/----'
const EMPTY_CONTENT = 'Nenhuma anotacao registrada para esta sessao.'

export function EvolutionViewer({
  record,
  psychologist,
  onBack,
}: IEvolutionViewer) {
  const [isGenerating, setIsGenerating] = useState(false)

  const { patientName, content, date, diagnosis } = record
  const readableDate = Time.toDayLongMonthYear(date)

  const handleExportPDF = useCallback(async () => {
    try {
      setIsGenerating(true)

      const blob = await pdf(
        <SessionPDFTemplate
          psychologist={psychologist}
          record={{
            patientName,
            date: Time.toBrazilianFormat(date) || EMPTY_DATE,
            content: content || 'Nenhuma evolucao registrada.',
            diagnosis: diagnosis || 'Nao informado',
          }}
        />,
      ).toBlob()

      const stamp = Time.toFileStamp(date) || 'data-indisponivel'
      const safeName = patientName.replace(/\s+/g, '-')

      Files.saveBlob(blob, `Evolucao-${safeName}-${stamp}.pdf`)
      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar o arquivo PDF.')
    } finally {
      setIsGenerating(false)
    }
  }, [psychologist, patientName, content, date, diagnosis])

  return (
    <div className="ev-root">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="ev-back-btn"
        >
          <ArrowLeft size={14} />
          <span className="ev-back-label">Voltar ao historico</span>
        </Button>
      </div>

      <div className="ev-heading">
        <div className="ev-title-row">
          <FileText className="ev-title-icon" />
          <h2 className="ev-title">Evolucao Psicologica</h2>
        </div>

        <div className="ev-meta">
          <p className="ev-meta-patient">
            Paciente:{' '}
            <span className="ev-meta-patient-name">{patientName}</span>
          </p>
          <p className="ev-meta-date">
            {readableDate || 'Data nao disponivel'}
          </p>
        </div>
      </div>

      <Separator className="ev-separator" />

      <div className="ev-content">
        <p className="ev-content-text">{content || EMPTY_CONTENT}</p>
      </div>

      <Separator className="ev-separator" />

      <div className="ev-footer">
        <p className="ev-footer-note">
          Este documento e sigiloso e de uso restrito, gerado a partir de
          registro eletronico de prontuario.
        </p>

        <Button
          onClick={handleExportPDF}
          disabled={isGenerating}
          className="ev-export-btn"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isGenerating ? 'Gerando...' : 'Gerar PDF Oficial'}
        </Button>
      </div>
    </div>
  )
}
