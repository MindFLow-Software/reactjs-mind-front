import { Button } from '@/components/ui/button'
import { FileDown, Check, Copy, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import './anamnesis-header.css'

interface PdfState {
  isExporting: boolean
  exportedSuccessfully: boolean
  isCopyDisabled: boolean
}

interface AnamnesisHeaderProps {
  pdf: PdfState
  copied: boolean
  onGeneratePDF: () => void
  onCopy: () => void
}

function renderPdfButtonContent(
  isExporting: boolean,
  exportedSuccessfully: boolean,
) {
  if (isExporting) {
    return (
      <>
        <Loader2 className="ph-anamnesis-header__btn-icon--spin" />
        <span>Gerando...</span>
      </>
    )
  }

  if (exportedSuccessfully) {
    return (
      <>
        <Check className="ph-anamnesis-header__btn-icon" />
        <span>Baixado</span>
      </>
    )
  }

  return (
    <>
      <FileDown className="ph-anamnesis-header__btn-icon" />
      <span>Gerar PDF</span>
    </>
  )
}

export function AnamnesisHeader({
  pdf,
  copied,
  onGeneratePDF,
  onCopy,
}: AnamnesisHeaderProps) {
  return (
    <div className="ph-anamnesis-header">
      <div className="ph-anamnesis-header__title-wrap">
        <h2 className="ph-anamnesis-header__title">Anamnese</h2>
        <p className="ph-anamnesis-header__subtitle">
          Blocos editáveis com salvamento automático e rascunho local.
        </p>
      </div>

      <div className="ph-anamnesis-header__actions">
        <Button
          type="button"
          size="sm"
          onClick={onGeneratePDF}
          disabled={pdf.isExporting || pdf.isCopyDisabled}
          className={cn(
            'ph-anamnesis-header__pdf-btn',
            pdf.isExporting && 'ph-anamnesis-header__pdf-btn--exporting',
            pdf.exportedSuccessfully && 'ph-anamnesis-header__pdf-btn--success',
          )}
        >
          {renderPdfButtonContent(pdf.isExporting, pdf.exportedSuccessfully)}
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={onCopy}
          disabled={pdf.isCopyDisabled}
          className={cn(
            'ph-anamnesis-header__copy-btn',
            copied && 'ph-anamnesis-header__copy-btn--copied',
          )}
        >
          {copied ? (
            <>
              <Check className="ph-anamnesis-header__btn-icon" />
              Copiado
            </>
          ) : (
            <>
              <Copy className="ph-anamnesis-header__btn-icon" />
              Copiar Anamnese
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
