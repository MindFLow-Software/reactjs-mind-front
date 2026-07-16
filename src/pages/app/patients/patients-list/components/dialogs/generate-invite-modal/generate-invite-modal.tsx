import './generate-invite-modal.css'
import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2, QrCode, Copy, Check, RefreshCw, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Clipboard } from '@/utils/clipboard'
import { useActiveRegistrationLink } from '@/hooks/use-active-registration-link'
import { useGenerateRegistrationLink } from '../../../hooks/use-generate-registration-link'

import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const COPIED_FEEDBACK_MS = 2000

export function GenerateInviteModal() {
  const [copied, setCopied] = useState(false)

  const { data } = useActiveRegistrationLink()
  const { generateRegistrationLink, isGenerating } =
    useGenerateRegistrationLink()

  const registrationLink = data?.registrationLink

  function handleCopyToClipboard() {
    Clipboard.copy(registrationLink?.url)
    setCopied(true)
    setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
  }

  function renderBody() {
    if (!registrationLink) {
      return (
        <div className="gim-blank">
          <div className="gim-blank-icon-box">
            <QrCode className="gim-blank-icon" />
          </div>
          <p className="gim-blank-text">
            Clique no botão abaixo para gerar um link único de cadastro para seu
            paciente.
          </p>
          <Button
            size="lg"
            disabled={isGenerating}
            onClick={generateRegistrationLink}
            className="gim-generate-btn"
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Gerar Link de Acesso
          </Button>
        </div>
      )
    }

    return (
      <div className="gim-link-view">
        <div className="gim-qr-box">
          <QRCodeSVG value={registrationLink.url} size={180} level="H" />
        </div>

        <p className="gim-qr-hint">
          Aponte a câmera do celular para o QR Code ou copie o link abaixo
        </p>

        <div className="gim-link-actions">
          <div className="gim-link-row">
            <span className="gim-link-url">{registrationLink.url}</span>
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className={cn(
                'gim-copy-btn',
                copied ? 'gim-copy-btn--copied' : 'gim-copy-btn--idle',
              )}
            >
              {copied ? (
                <>
                  <Check className="size-3.5" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copiar
                </>
              )}
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={generateRegistrationLink}
            className="gim-refresh-btn"
          >
            <RefreshCw className="size-3.5" />
            Gerar novo link
          </Button>
        </div>
      </div>
    )
  }

  return (
    <DialogContent className="gim-content">
      <div className="gim-header">
        <DialogHeader>
          <DialogTitle className="gim-title">
            <div className="gim-title-icon">
              <QrCode className="size-4" />
            </div>
            Convite via QR Code
          </DialogTitle>
          <DialogDescription className="gim-description">
            O paciente será direcionado para o seu formulário de cadastro.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="gim-body">{renderBody()}</div>
    </DialogContent>
  )
}
