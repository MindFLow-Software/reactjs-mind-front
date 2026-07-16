'use client'

import { CheckCircle2, Sparkles } from 'lucide-react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import './suggestion-success-dialog.css'

type ISuggestionSuccessDialog = {
  onClose: () => void
}

export function SuggestionSuccessDialog({ onClose }: ISuggestionSuccessDialog) {
  return (
    <DialogContent className="css-success-content">
      <div className="css-success-header">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />

        <DialogHeader className="relative flex flex-col items-center justify-center text-center gap-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
            <div className="css-success-icon">
              <CheckCircle2 className="size-11 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
              Sugestão Enviada!
              <Sparkles className="size-5 text-amber-500 fill-amber-400 animate-in spin-in duration-700 delay-300" />
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center text-base pt-1 text-balance mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
              Muito obrigado pelo seu feedback. Sua ideia é fundamental para
              evoluirmos a plataforma.
            </DialogDescription>
          </div>
        </DialogHeader>
      </div>

      <div className="p-8 flex flex-col gap-6 bg-card">
        <div className="css-success-steps">
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Próximos passos
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nossa equipe analisará sua sugestão. Se aprovada, ela aparecerá
                no board em até{' '}
                <span className="font-semibold text-blue-600">48 horas</span>.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="animate-in fade-in slide-in-from-bottom duration-500 delay-400">
          <Button onClick={onClose} className="css-success-cta">
            Entendido
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  )
}
