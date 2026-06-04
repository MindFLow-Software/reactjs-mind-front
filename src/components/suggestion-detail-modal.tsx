'use client'

import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  Bell,
  Share2,
  X,
  Link2,
  MessageCircle,
  ChevronUp,
  Check,
  ChevronRight,
  Zap,
  Clock,
  Users,
  Paperclip,
  AtSign,
  Bold,
  TriangleAlert,
  Eye,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Suggestion } from '@/api/suggestions/get-suggestions'
import { DialogPortal, DialogOverlay } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

type SuggestionStatus = Suggestion['status']
type CategoryKey = Suggestion['category']

const CATEGORY_CONFIG: Record<
  CategoryKey,
  {
    label: string
    dot: string
    pillBg: string
    pillText: string
  }
> = {
  UI_UX: {
    label: 'Fluxo',
    dot: 'bg-violet-500',
    pillBg: 'bg-violet-50 dark:bg-violet-950/30',
    pillText: 'text-violet-700 dark:text-violet-300',
  },
  REPORTS: {
    label: 'Relatórios',
    dot: 'bg-amber-500',
    pillBg: 'bg-amber-50 dark:bg-amber-950/30',
    pillText: 'text-amber-700 dark:text-amber-300',
  },
  INTEGRATIONS: {
    label: 'Integrações',
    dot: 'bg-blue-500',
    pillBg: 'bg-blue-50 dark:bg-blue-950/30',
    pillText: 'text-blue-700 dark:text-blue-300',
  },
  SCHEDULING: {
    label: 'Paciente',
    dot: 'bg-pink-500',
    pillBg: 'bg-pink-50 dark:bg-pink-950/30',
    pillText: 'text-pink-700 dark:text-pink-300',
  },
  PRIVACY_LGPD: {
    label: 'Financeiro',
    dot: 'bg-emerald-500',
    pillBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    pillText: 'text-emerald-700 dark:text-emerald-300',
  },
  OTHERS: {
    label: 'Outros',
    dot: 'bg-slate-400',
    pillBg: 'bg-slate-100 dark:bg-slate-800',
    pillText: 'text-slate-600 dark:text-slate-300',
  },
}

const STATUS_CONFIG: Record<
  SuggestionStatus,
  {
    label: string
    bannerBg: string
    bannerText: string
    blobColor: string
    currentStep: number
  }
> = {
  PENDING: {
    label: 'AGUARDANDO',
    bannerBg: 'bg-blue-50 dark:bg-blue-950/30',
    bannerText: 'text-blue-700 dark:text-blue-400',
    blobColor: 'bg-blue-500',
    currentStep: 0,
  },
  OPEN: {
    label: 'EM VOTAÇÃO',
    bannerBg: 'bg-blue-50 dark:bg-blue-950/30',
    bannerText: 'text-blue-700 dark:text-blue-400',
    blobColor: 'bg-blue-500',
    currentStep: 1,
  },
  UNDER_REVIEW: {
    label: 'EM ESTUDO',
    bannerBg: 'bg-purple-50 dark:bg-purple-950/30',
    bannerText: 'text-purple-700 dark:text-purple-400',
    blobColor: 'bg-purple-500',
    currentStep: 2,
  },
  PLANNED: {
    label: 'IMPLEMENTANDO',
    bannerBg: 'bg-amber-50 dark:bg-amber-950/30',
    bannerText: 'text-amber-700 dark:text-amber-400',
    blobColor: 'bg-amber-500',
    currentStep: 3,
  },
  IMPLEMENTED: {
    label: 'CONCLUÍDO',
    bannerBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    bannerText: 'text-emerald-700 dark:text-emerald-400',
    blobColor: 'bg-emerald-500',
    currentStep: 4,
  },
  REJECTED: {
    label: 'REJEITADA',
    bannerBg: 'bg-red-50 dark:bg-red-950/30',
    bannerText: 'text-red-700 dark:text-red-400',
    blobColor: 'bg-red-500',
    currentStep: -1,
  },
}

const BANNER_STEPS = [
  { label: 'Aprovada' },
  { label: 'Em votação' },
  { label: 'Em estudo' },
  { label: 'Implementando' },
  { label: 'Concluído' },
]

const TIMELINE_STEPS = [
  { label: 'Sugestão enviada' },
  { label: 'Aprovada pela moderação' },
  { label: 'Em votação aberta' },
  { label: 'Em estudo pela equipe' },
  { label: 'Implementando' },
  { label: 'Beta privado' },
  { label: 'Disponível para todos' },
]

const MOCK_RELATED = [
  { votes: 312, title: 'Transcrição automática de sessões' },
  { votes: 204, title: 'App mobile para pacientes' },
  { votes: 87, title: 'Relatórios de evolução automáticos' },
]

const TIMELINE_CONFIG: Record<
  SuggestionStatus,
  { doneUntil: number; currentIdx: number }
> = {
  PENDING: { doneUntil: 0, currentIdx: 1 },
  OPEN: { doneUntil: 1, currentIdx: 2 },
  UNDER_REVIEW: { doneUntil: 2, currentIdx: 3 },
  PLANNED: { doneUntil: 3, currentIdx: 4 },
  IMPLEMENTED: { doneUntil: 6, currentIdx: -1 },
  REJECTED: { doneUntil: -1, currentIdx: -1 },
}

interface SuggestionDetailModalContentProps {
  item: Suggestion
  userId?: string
  onLike: (id: string) => void
}

export function SuggestionDetailModalContent({
  item,
  userId,
  onLike,
}: SuggestionDetailModalContentProps) {
  const [comment, setComment] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [previewItem, setPreviewItem] = useState<{
    url: string
    name: string
  } | null>(null)

  const buildAttachmentUrl = (id: string) =>
    `${(import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? 'http://localhost:8080'}/attachments/${id}`

  const isLiked = userId ? item.likes?.includes(userId) : false
  const isImplemented = item.status === 'IMPLEMENTED'
  const cat = CATEGORY_CONFIG[item.category]
  const statusCfg = STATUS_CONFIG[item.status]
  const timelineCfg = TIMELINE_CONFIG[item.status]

  const initials = item.psychologistName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()

  const formattedDate = format(
    new Date(item.createdAt),
    "dd 'de' MMM. 'de' yyyy",
    { locale: ptBR },
  )
  const relativeDate = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
    locale: ptBR,
  })
  const relativeShort = relativeDate.replace('há ', '').replace('em ', '')

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiado ✓')
    } catch {
      toast.error('Não foi possível copiar o link')
    }
  }

  return (
    <DialogPortal>
      <DialogOverlay className="bg-[rgba(15,52,100,0.45)] backdrop-blur-[4px]" />
      <DialogPrimitive.Content
        aria-labelledby="dm-title"
        className={cn(
          'fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
          'w-full max-w-[min(960px,calc(100vw-2rem))]',
          'max-h-[92vh] flex flex-col overflow-hidden',
          'rounded-2xl border border-border bg-background',
          'shadow-[0_12px_32px_rgba(15,52,100,0.12)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'duration-200',
        )}
      >
        {/* STATUS BANNER */}
        <div
          className={cn(
            'flex items-center gap-2.5 px-5 shrink-0 h-10 border-b border-border/60',
            statusCfg.bannerBg,
          )}
        >
          <span
            className={cn('size-2 rounded-full shrink-0', statusCfg.blobColor)}
          />
          <span
            className={cn(
              'text-[11.5px] font-bold tracking-[0.07em] shrink-0',
              statusCfg.bannerText,
            )}
          >
            {statusCfg.label}
          </span>
          <span className="text-slate-300 dark:text-slate-600 shrink-0">·</span>

          {/* Stepper — oculto em mobile */}
          <div className="hidden sm:flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
            {BANNER_STEPS.map((step, i) => {
              const isDone = i < statusCfg.currentStep
              const isCurrent = i === statusCfg.currentStep
              return (
                <div key={i} className="flex items-center gap-1 shrink-0">
                  {i > 0 && (
                    <ChevronRight className="size-3 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        'size-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0',
                        isDone
                          ? cn(statusCfg.blobColor, 'text-white')
                          : isCurrent
                            ? 'bg-blue-500 text-white ring-2 ring-blue-500/30 ring-offset-1 ring-offset-transparent'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
                      )}
                      aria-label={`Etapa ${i + 1} de ${BANNER_STEPS.length}: ${step.label}`}
                    >
                      {isDone ? (
                        <Check className="size-2.5" strokeWidth={3} />
                      ) : isCurrent ? (
                        <span className="size-1.5 rounded-full bg-white block" />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    {(isDone || isCurrent) && (
                      <span
                        className={cn(
                          'text-[11px] font-medium hidden lg:block whitespace-nowrap',
                          statusCfg.bannerText,
                        )}
                      >
                        {step.label}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
            <Link2 className="size-2.5" />
            <span>SUG-{item.id.slice(-4).toUpperCase()}</span>
          </div>
        </div>

        {/* HEADER */}
        <div className="flex gap-4 items-start px-[22px] pt-[18px] pb-3 shrink-0 border-b border-border">
          {/* Vote button */}
          {isImplemented ? (
            <div className="flex flex-col items-center justify-center gap-1 shrink-0 w-16 py-2">
              <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
                <Check
                  className="size-5 text-emerald-600 dark:text-emerald-400"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide text-center">
                Disponível
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onLike(item.id)}
              aria-pressed={isLiked}
              title={isLiked ? 'Remover voto' : 'Votar nessa sugestão'}
              className={cn(
                'flex flex-col items-center justify-center gap-1 shrink-0 w-16 min-h-[72px]',
                'rounded-[6px] border-[1.5px] px-1 py-2.5',
                'transition-all cursor-pointer active:scale-95',
                isLiked
                  ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                  : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-border dark:bg-muted/50 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 dark:hover:border-blue-500',
              )}
            >
              <ChevronUp className="size-[18px]" strokeWidth={2.5} />
              <span className="text-[20px] font-bold tabular-nums leading-none">
                {item.likesCount}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.06em]">
                VOTOS
              </span>
            </button>
          )}

          {/* Título + meta */}
          <div className="flex-1 min-w-0 space-y-2">
            <h2
              id="dm-title"
              className="text-[21px] font-bold leading-[1.25] tracking-[-0.015em] text-foreground"
            >
              {item.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                  cat.pillBg,
                  cat.pillText,
                )}
              >
                <span
                  className={cn('size-1.5 rounded-full shrink-0', cat.dot)}
                />
                {cat.label}
              </span>
              <span className="size-[3px] rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
              <div className="flex items-center gap-1.5">
                <div className="size-[18px] rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[8px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                  {initials}
                </div>
                <span className="text-[11.5px] text-muted-foreground">
                  por{' '}
                  <strong className="font-semibold text-foreground">
                    {item.psychologistName}
                  </strong>
                </span>
              </div>
              <span className="size-[3px] rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
              <span
                className="text-[11.5px] text-muted-foreground"
                title={formattedDate}
              >
                {relativeDate}
              </span>
              <span className="size-[3px] rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
              <span className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                <MessageCircle className="size-3" />
                <span>0</span>
              </span>
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <button
              type="button"
              title={isFollowing ? 'Parar de seguir' : 'Seguir atualizações'}
              aria-label={
                isFollowing ? 'Parar de seguir' : 'Seguir atualizações'
              }
              onClick={() => setIsFollowing((v) => !v)}
              className={cn(
                'size-[34px] rounded-lg border flex items-center justify-center transition-colors',
                isFollowing
                  ? 'border-blue-300 bg-blue-50 text-blue-600 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                  : 'border-border bg-card hover:bg-muted/50 text-muted-foreground',
              )}
            >
              <Bell className="size-4" />
            </button>
            <button
              type="button"
              title="Compartilhar"
              aria-label="Compartilhar"
              onClick={handleCopyLink}
              className="size-[34px] rounded-lg border border-border bg-card hover:bg-muted/50 text-muted-foreground flex items-center justify-center transition-colors"
            >
              <Share2 className="size-4" />
            </button>
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                title="Fechar"
                aria-label="Fechar"
                className="size-[34px] rounded-lg hover:bg-muted/50 text-muted-foreground flex items-center justify-center transition-colors"
              >
                <X className="size-4" />
              </button>
            </DialogPrimitive.Close>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          {/* Coluna principal */}
          <div className="flex-1 overflow-y-auto px-[22px] pt-[6px] pb-[22px] space-y-5 min-w-0 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30">
            {/* Descrição */}
            <div className="bg-slate-50 dark:bg-muted/30 border border-slate-100 dark:border-border rounded-[10px] p-[14px] mt-4">
              <p className="text-[14px] leading-[1.6] text-slate-800 dark:text-foreground whitespace-pre-wrap break-words">
                {item.description}
              </p>
            </div>

            {/* Anexos — só exibe se existirem */}
            {item.attachments && item.attachments.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5">
                  <Paperclip className="size-[13px] text-muted-foreground" />
                  <span className="text-[11px] uppercase font-bold tracking-[0.06em] text-muted-foreground">
                    Anexos
                  </span>
                  <span className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                    {item.attachments.length}
                  </span>
                </div>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(130px, 1fr))',
                  }}
                >
                  {item.attachments.map((att, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setPreviewItem({
                          url: buildAttachmentUrl(att),
                          name: att,
                        })
                      }
                      className="group relative rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950/40 dark:to-blue-900/40 cursor-pointer"
                      style={{ aspectRatio: '4/3' }}
                    >
                      <img
                        src={buildAttachmentUrl(att)}
                        alt={att}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Eye className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/70 to-transparent flex items-end px-2 pb-1">
                        <span className="text-[10px] text-white font-medium truncate">
                          {att}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Discussão */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="size-[13px] text-muted-foreground" />
                <span className="text-[11px] uppercase font-bold tracking-[0.06em] text-muted-foreground">
                  Discussão
                </span>
                <span className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                  0
                </span>
              </div>

              {/* Composer */}
              <div className="flex gap-2.5">
                <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[11px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                  {initials}
                </div>
                <div className="flex-1 border border-border rounded-xl overflow-hidden focus-within:border-blue-600 focus-within:ring-[3px] focus-within:ring-blue-600/[.18] transition-all bg-card">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Adicione um comentário..."
                    className="resize-none min-h-[64px] max-h-[120px] border-none shadow-none focus-visible:ring-0 text-[13px] bg-transparent"
                  />
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-border bg-muted/30">
                    <button
                      type="button"
                      title="Mencionar"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <AtSign className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Anexar"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Paperclip className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Negrito"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Bold className="size-3.5" />
                    </button>
                    <span className="text-[11px] text-muted-foreground ml-1 hidden sm:block">
                      Markdown suportado
                    </span>
                    <div className="flex-1" />
                    <button
                      type="button"
                      disabled={comment.length === 0}
                      className={cn(
                        'text-[12px] font-semibold px-3 py-1 rounded-lg bg-blue-600 text-white',
                        comment.length === 0
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-blue-700 cursor-pointer transition-colors',
                      )}
                    >
                      Comentar
                    </button>
                  </div>
                </div>
              </div>

              {/* Thread vazia */}
              <p className="text-center text-[12px] text-muted-foreground py-6 italic">
                Seja o primeiro a comentar nessa sugestão.
              </p>
            </div>
          </div>

          {/* Aside */}
          <div className="md:w-[290px] shrink-0 border-t md:border-t-0 md:border-l border-border bg-slate-50 dark:bg-muted/20 overflow-y-auto p-[18px] space-y-[18px] scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/30">
            {/* Quem votou */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <span className="text-[11px] uppercase font-bold tracking-[0.06em] text-muted-foreground block">
                Quem votou
              </span>
              {item.likesCount > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    {Array.from({ length: Math.min(5, item.likesCount) }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'size-7 rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-card flex items-center justify-center text-[9px] font-bold text-blue-700 dark:text-blue-300',
                            i > 0 && '-ml-2',
                          )}
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ),
                    )}
                    {item.likesCount > 5 && (
                      <div className="-ml-2 size-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-semibold text-muted-foreground">
                        +{item.likesCount - 5}
                      </div>
                    )}
                  </div>
                  <p className="text-[12.5px] text-muted-foreground">
                    <strong className="text-foreground font-bold">
                      {item.likesCount}
                    </strong>{' '}
                    psicólogos votaram
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground italic">
                  Nenhum voto ainda.
                </p>
              )}
            </div>

            {/* Jornada */}
            <div className="bg-card border border-border rounded-xl p-4">
              <span className="text-[11px] uppercase font-bold tracking-[0.06em] text-muted-foreground block mb-4">
                Jornada
              </span>
              <div className="relative">
                <div className="absolute left-[12px] top-3 bottom-3 w-px bg-border" />
                <div className="space-y-0">
                  {TIMELINE_STEPS.map((step, i) => {
                    const isDone = i <= timelineCfg.doneUntil
                    const isCurrent = i === timelineCfg.currentIdx
                    return (
                      <div
                        key={i}
                        className="relative flex items-center gap-3 py-2 pl-8"
                      >
                        <div
                          className={cn(
                            'absolute left-0 size-[26px] rounded-full border-2 flex items-center justify-center shrink-0 z-10',
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : isCurrent
                                ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                                : 'bg-card border-border',
                          )}
                        >
                          {isDone ? (
                            <Check className="size-3" strokeWidth={3} />
                          ) : isCurrent ? (
                            <Zap className="size-3" />
                          ) : (
                            <span className="size-1.5 rounded-full bg-border" />
                          )}
                        </div>
                        <div
                          className={cn(!isDone && !isCurrent && 'opacity-40')}
                        >
                          <p
                            className={cn(
                              'text-[12.5px] font-semibold leading-tight',
                              isDone || isCurrent
                                ? 'text-foreground'
                                : 'text-muted-foreground',
                            )}
                          >
                            {step.label}
                          </p>
                          {isDone && (
                            <p className="text-[11px] tabular-nums text-muted-foreground mt-0.5">
                              {formattedDate}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Mini-stats 2×2 */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                {[
                  {
                    label: 'Votos',
                    value: String(item.likesCount),
                    Icon: ChevronUp,
                  },
                  { label: 'Comentários', value: '0', Icon: MessageCircle },
                  { label: 'Aberta há', value: relativeShort, Icon: Clock },
                  { label: 'Seguidores', value: '0', Icon: Users },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={cn(
                      'p-3',
                      i % 2 === 0 && 'border-r border-border',
                      i < 2 && 'border-b border-border',
                    )}
                  >
                    <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
                      <stat.Icon className="size-3" />
                      <span className="text-[10px] font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-[15px] font-bold text-foreground tabular-nums">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relacionadas */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <span className="text-[11px] uppercase font-bold tracking-[0.06em] text-muted-foreground block">
                Relacionadas
              </span>
              <div className="space-y-1">
                {MOCK_RELATED.map((rel, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full flex items-start gap-2 text-left hover:bg-muted/50 rounded-lg p-1.5 -mx-1.5 transition-colors cursor-pointer"
                  >
                    <span className="text-[13px] font-bold text-muted-foreground tabular-nums w-8 shrink-0 mt-px">
                      {rel.votes}
                    </span>
                    <span className="text-[12.5px] text-foreground leading-[1.4] line-clamp-2">
                      {rel.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center gap-3 px-[22px] py-3 border-t border-border bg-card shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <Link2 className="size-3.5" />
            <span>Copiar link</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="size-3.5" />
            <span>Discutir no canal</span>
          </button>
          <div className="flex-1" />
          <button
            type="button"
            className="flex items-center gap-1.5 text-[12px] text-red-500/70 hover:text-red-600 transition-colors"
          >
            <TriangleAlert className="size-3.5" />
            <span>Reportar</span>
          </button>
        </div>

        {/* Preview de anexo */}
        {previewItem && (
          <div className="absolute inset-0 z-20 flex flex-col overflow-hidden rounded-2xl bg-[#0d1117]">
            <div className="flex items-center gap-3 px-5 py-4 shrink-0">
              <p
                className="flex-1 min-w-0 text-sm font-semibold text-white truncate"
                title={previewItem.name}
              >
                {previewItem.name}
              </p>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                aria-label="Fechar visualização"
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/60 hover:text-white hover:border-white/50 transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="h-[3px] bg-blue-600 shrink-0" />
            <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
              <img
                src={previewItem.url}
                alt={previewItem.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="px-5 py-3 shrink-0 flex justify-start">
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="text-[11px] tracking-[0.1em] uppercase font-semibold text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
