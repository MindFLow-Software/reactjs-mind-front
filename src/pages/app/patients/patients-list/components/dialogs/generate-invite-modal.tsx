'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Loader2, QrCode, Copy, Check, RefreshCw, Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

import { copyToClipboard } from '@/utils/copy-to-clipboard'
import { useActiveRegistrationLink } from '@/hooks/use-active-registration-link'
import { useGenerateRegistrationLink } from '../../hooks/use-generate-registration-link'

import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

export function GenerateInviteModal() {
  const [copied, setCopied] = useState(false)

  const { data } = useActiveRegistrationLink()
  const { generateRegistrationLink, isGenerating } =
    useGenerateRegistrationLink()

  const registrationLink = data?.registrationLink

  function handleCopyToClipboard() {
    copyToClipboard(registrationLink?.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DialogContent className="max-w-xl! p-0 gap-0 overflow-hidden rounded-2xl">
      <div className="px-6 py-5 border-b border-border bg-muted/40">
        <DialogHeader className="">
          <DialogTitle className="flex items-center gap-3 text-base font-semibold text-foreground">
            <div className="flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground shrink-0">
              <QrCode className="size-4" />
            </div>
            Convite via QR Code
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pl-12 pt-0.5">
            O paciente será direcionado para o seu formulário de cadastro.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="p-6">
        {!registrationLink ? (
          <div className="flex flex-col items-center justify-center py-10 gap-5">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-muted">
              <QrCode className="w-9 h-9 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
              Clique no botão abaixo para gerar um link único de cadastro para
              seu paciente.
            </p>
            <Button
              size="lg"
              disabled={isGenerating}
              onClick={generateRegistrationLink}
              className="w-full max-w-xs cursor-pointer font-medium gap-2"
            >
              {isGenerating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Gerar Link de Acesso
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="p-5 bg-card rounded-2xl border border-border shadow-sm">
              <QRCodeSVG value={registrationLink.url} size={180} level="H" />
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Aponte a câmera do celular para o QR Code ou copie o link abaixo
            </p>

            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30">
                <span className="flex-1 min-w-0 text-xs font-mono text-muted-foreground whitespace-nowrap overflow-x-auto select-all">
                  {registrationLink.url}
                </span>
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 h-7 w-20 shrink-0 rounded-md text-xs font-medium transition-colors cursor-pointer',
                    copied
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/70',
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
                className="w-full cursor-pointer text-muted-foreground hover:text-foreground gap-2"
              >
                <RefreshCw className="size-3.5" />
                Gerar novo link
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  )
}
