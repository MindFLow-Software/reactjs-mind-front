'use client'

import {
  HelpCircle,
  Search,
  FileText,
  ThumbsUp,
  Rocket,
  Lightbulb,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import './suggestion-help-button.css'

const STEPS = [
  {
    title: 'Pesquise antes',
    description:
      'Use a busca para ver se sua ideia já existe e evitar sugestões duplicadas.',
    icon: Search,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    title: 'Capriche no detalhe',
    description:
      'Explique o porquê e como sua ideia ajudaria no dia a dia clínico.',
    icon: FileText,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
  },
  {
    title: 'Vote em outras',
    description:
      'Curtiu uma sugestão? Vote! As mais apoiadas ganham prioridade.',
    icon: ThumbsUp,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    title: 'Acompanhe o status',
    description:
      'Veja sua ideia evoluir de sugestão até funcionalidade entregue.',
    icon: Rocket,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30',
  },
]

export function SuggestionHelpButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <button className="shb-fab">
                  <HelpCircle className="size-6" />
                </button>
              </TooltipTrigger>
            </DialogTrigger>
            <TooltipContent
              side="left"
              className="bg-slate-900 text-white border-none text-xs font-semibold px-3 py-2 mb-2"
            >
              Comunidade MindFlow
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none sm:rounded-2xl">
          <DialogHeader className="shb-header">
            <div className="flex items-center gap-4">
              <div className="shb-header-icon">
                <Lightbulb className="size-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-extrabold text-foreground">
                  Comunidade MindFlow
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Suas ideias ajudam a definir os próximos passos do sistema.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="cursor-pointer grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={cn(
                  'shb-step group',
                  index < 2 && 'md:border-b border-border',
                )}
              >
                <div className={cn('shb-step-icon', step.bg)}>
                  <step.icon className={cn('size-5', step.color)} />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-muted-foreground tracking-widest">
                    PASSO {index + 1}
                  </span>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/50 border-t border-border text-center">
            <p className="text-[13px] text-muted-foreground font-medium">
              ❤️ As sugestões são avaliadas semanalmente com base no número de
              votos. ❤️
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
