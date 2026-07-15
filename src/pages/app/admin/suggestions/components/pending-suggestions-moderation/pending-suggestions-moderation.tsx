'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Check,
  X,
  MessageSquare,
  Loader2,
  Calendar,
  User,
  Eye,
  Save,
  Tag,
  FileText,
  AlignLeft,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { getSuggestions } from '@/api/suggestions/get-suggestions'
import type { UpdateSuggestionParams } from '@/api/suggestions/update-suggestion-status'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUpdateSuggestionStatus } from '../../hooks/use-update-suggestion-status'
import { translatedSuggestionCategory } from '@/constants/translated-suggestion-category'
import './pending-suggestions-moderation.css'

export function PendingSuggestionsModeration() {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['admin', 'suggestions', 'pending'],
    queryFn: () => getSuggestions({ status: 'PENDING' }),
  })

  const { mutateAsync: handleUpdateStatus, isPending: isUpdating } =
    useUpdateSuggestionStatus()

  const isEmpty = !suggestions || suggestions.length === 0

  return (
    <Card className="border-border bg-card shadow-md rounded-2xl overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageSquare className="size-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Fila de Moderação
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Avalie e edite os feedbacks antes de torná-los públicos
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 cursor-pointer">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : isEmpty ? (
          <div className="p-12 text-center flex flex-col gap-2">
            <Check className="size-8 text-emerald-500 mx-auto opacity-20" />
            <p className="text-sm text-muted-foreground font-medium">
              Nenhuma sugestão pendente no momento.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {suggestions.map((item) => (
              <SuggestionModerationItem
                key={item.id}
                item={item}
                onUpdate={handleUpdateStatus}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface SuggestionModerationItemProps {
  item: ISuggestion
  onUpdate: (data: UpdateSuggestionParams) => Promise<unknown>
  isUpdating: boolean
}

function SuggestionModerationItem({
  item,
  onUpdate,
  isUpdating,
}: SuggestionModerationItemProps) {
  const [title, setTitle] = useState(item.title)
  const [category, setCategory] = useState<string>(item.category)
  const [description, setDescription] = useState(item.description)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  async function handleAction(status?: UpdateSuggestionParams['status']) {
    try {
      await onUpdate({
        id: item.id,
        status: status || item.status,
        title,
        category,
        description,
      })
      setIsDialogOpen(false)
    } catch {
      // handled by useUpdateSuggestionStatus error toast
    }
  }

  return (
    <div className="ads-mod-row">
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="ads-mod-badge">
            {translatedSuggestionCategory[item.category] || 'Geral'}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
            <Calendar className="size-3" />{' '}
            {format(new Date(item.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>
        <h4 className="font-bold text-foreground text-sm break-all leading-tight">
          {item.title}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed max-w-3xl italic break-all">
          &quot;{item.description}&quot;
        </p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
          <User className="size-3" /> Enviado por{' '}
          {item.psychologistName || 'Psicólogo'}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ads-mod-review-btn">
              <Eye className="size-3.5" /> Revisar e Editar
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[650px] border-border bg-card gap-6 rounded-2xl overflow-hidden min-w-0">
            <DialogHeader className="min-w-0 overflow-hidden">
              <DialogTitle className="text-xl font-bold text-foreground leading-tight break-all">
                Revisão de Conteúdo
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-5 min-w-0 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 min-w-0">
                  <Label className="ads-mod-field-label">
                    <FileText className="size-3" /> Título (Editável)
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="ads-mod-field-input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="ads-mod-field-label">
                    <Tag className="size-3" /> Categoria
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="ads-mod-field-select-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectGroup>
                        {Object.entries(translatedSuggestionCategory).map(
                          ([val, label]) => (
                            <SelectItem key={val} value={val}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-0">
                <Label className="ads-mod-field-label">
                  <AlignLeft className="size-3" /> Descrição da Sugestão
                  (Editável)
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="ads-mod-textarea break-all"
                  placeholder="Corrija erros ou remova termos impróprios aqui..."
                />
              </div>

              <footer className="ads-mod-footer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="ads-mod-footer-avatar">
                    <User className="size-4" />
                  </div>
                  <div className="flex flex-col text-[11px] min-w-0 overflow-hidden">
                    <span className="ads-mod-footer-label">Autor Original</span>
                    <span className="font-bold text-foreground truncate">
                      {item.psychologistName || 'Não identificado'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] min-w-0 overflow-hidden">
                  <div className="ads-mod-footer-avatar">
                    <Calendar className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0 overflow-hidden">
                    <span className="ads-mod-footer-label">Enviado em</span>
                    <span className="font-bold text-foreground truncate">
                      {format(
                        new Date(item.createdAt),
                        "dd 'de' MMMM 'às' HH:mm",
                        { locale: ptBR },
                      )}
                    </span>
                  </div>
                </div>
              </footer>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => handleAction()}
                disabled={isUpdating}
                className="ads-mod-save-btn h-11"
              >
                <Save className="size-4 mr-2" /> Salvar Edição
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-1 border-l border-border pl-2 ml-1 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleAction('OPEN')}
                  disabled={isUpdating}
                  variant="ghost"
                  size="icon"
                  className="ads-mod-approve-btn"
                >
                  {isUpdating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Aprovar sugestão</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => handleAction('REJECTED')}
                  disabled={isUpdating}
                  variant="ghost"
                  size="icon"
                  className="ads-mod-reject-btn"
                >
                  {isUpdating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <X className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Rejeitar sugestão</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
