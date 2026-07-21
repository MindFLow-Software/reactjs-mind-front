import { Button } from '@/components/ui/button'
import { FileDown, Check, Copy, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import './anamnesis-header-actions.css'

type IAnamnesisPdfState = {
  isExporting: boolean
  exportedSuccessfully: boolean
  isCopyDisabled: boolean
  copied: boolean
  onGeneratePDF: () => void
  onCopy: () => void
}

type IAnamnesisHeaderActions = {
  pdf: IAnamnesisPdfState
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

export function AnamnesisHeaderActions({ pdf }: IAnamnesisHeaderActions) {
  const { isExporting, exportedSuccessfully, isCopyDisabled, copied } = pdf

  return (
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
  )
}
