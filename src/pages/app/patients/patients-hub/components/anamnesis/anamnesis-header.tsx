import { Button } from '@/components/ui/button'
import { FileDown, Check, Copy, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import './anamnesis-header.css'

interface PdfState {
  isExporting: boolean
  exportedSuccessfully: boolean
  isCopyDisabled: boolean
  copied: boolean
  onGeneratePDF: () => void
  onCopy: () => void
}

interface AnamnesisHeaderProps {
  pdf: PdfState
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

export function AnamnesisHeader({ pdf }: AnamnesisHeaderProps) {
  const { isExporting, exportedSuccessfully, isCopyDisabled, copied } = pdf

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
          onClick={pdf.onGeneratePDF}
          disabled={isExporting || isCopyDisabled}
          className={cn(
            'ph-anamnesis-header__pdf-btn',
            isExporting && 'ph-anamnesis-header__pdf-btn--exporting',
            exportedSuccessfully && 'ph-anamnesis-header__pdf-btn--success',
          )}
        >
          {renderPdfButtonContent(isExporting, exportedSuccessfully)}
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={pdf.onCopy}
          disabled={isCopyDisabled}
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
