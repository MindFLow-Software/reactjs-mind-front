'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2, Lightbulb, FileText, Paperclip } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import {
  createSuggestionSchema,
  type CreateSuggestionSchema,
} from '@/validators/suggestions/form/create-suggestion-schema'
import { SuggestionAttachments } from './suggestion-attachments'
import { SuggestionSuccess } from './suggestion-success-dialog'
import { SuggestionCategoryPicker } from './suggestion-category-picker'
import { SUGGESTION_DESCRIPTION_MIN } from './create-suggestion-constants'
import { useCreateSuggestion } from './hooks/use-create-suggestion'
import './create-suggestion.css'

interface CreateSuggestionProps {
  onSuccess: () => void
}

export function CreateSuggestion({ onSuccess }: CreateSuggestionProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateSuggestionSchema>({
    resolver: zodResolver(createSuggestionSchema),
    defaultValues: { description: '' },
  })

  const { submitSuggestion, isSubmitting } = useCreateSuggestion({
    onSuccess: () => setIsSubmitted(true),
  })

  const descriptionValue = watch('description') || ''
  const selectedCategory = watch('category')

  async function onSubmit(data: CreateSuggestionSchema) {
    await submitSuggestion({ ...data, files })
  }

  if (isSubmitted) {
    return (
      <SuggestionSuccess
        onClose={() => {
          setIsSubmitted(false)
          setFiles([])
          reset()
          onSuccess()
        }}
      />
    )
  }

  return (
    <DialogContent className="max-w-2xl p-0 gap-0 flex flex-col max-h-[90vh] sm:rounded-2xl overflow-hidden">
      <DialogHeader className="px-6 pt-5 pb-4 border-b shrink-0">
        <div className="flex items-center gap-3">
          <div className="cs-header-icon">
            <Lightbulb className="size-5 text-blue-600" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-left">
              Nova sugestão
            </DialogTitle>
            <DialogDescription className="text-sm text-left">
              Descreva sua ideia em detalhes — quanto mais clara, mais rápido a
              comunidade entende e vota.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6 min-h-0">
        <div className="cs-hint">
          <div className="cs-hint-badge">
            <span className="text-blue-600 dark:text-blue-400 text-[10px] font-extrabold">
              i
            </span>
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Antes de enviar, dê uma olhada no board
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              Sua ideia pode já existir. Se encontrar algo parecido, prefira{' '}
              <strong>dar um voto</strong> na sugestão existente — assim ela
              ganha mais força.
            </p>
            <div className="cs-hint-pill">
              <span className="text-blue-500 dark:text-blue-400 font-bold">
                ✓
              </span>
              Mínimo de {SUGGESTION_DESCRIPTION_MIN} caracteres no detalhamento
            </div>
          </div>
        </div>

        <form
          id="create-suggestion-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-3.5 text-muted-foreground" />
              <span className="cs-section-label">Classificação</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="title"
                className={cn(
                  'text-sm font-medium',
                  errors.title && 'text-red-500',
                )}
              >
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Resuma sua ideia em uma frase curta"
                maxLength={80}
                className={cn(
                  errors.title && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              {errors.title && (
                <p className="cs-error">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label
                className={cn(
                  'text-sm font-medium',
                  errors.category && 'text-red-500',
                )}
              >
                Categoria <span className="text-red-500">*</span>
              </Label>
              <SuggestionCategoryPicker
                value={selectedCategory}
                onChange={(value) =>
                  setValue('category', value, { shouldValidate: true })
                }
              />
              {errors.category && (
                <p className="cs-error">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 text-muted-foreground" />
                <span className="cs-section-label">Detalhamento</span>
              </div>
              <span
                className={cn(
                  'cs-counter',
                  descriptionValue.length < SUGGESTION_DESCRIPTION_MIN
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
                    : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
                )}
              >
                {descriptionValue.length} / {SUGGESTION_DESCRIPTION_MIN}
              </span>
            </div>
            <Textarea
              {...register('description')}
              className={cn(
                'min-h-[120px] resize-none',
                errors.description &&
                  'border-red-500 focus-visible:ring-red-500',
              )}
              placeholder="Descreva detalhadamente o que você imaginou..."
            />
            {errors.description && (
              <p className="cs-error">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Paperclip className="size-3.5 text-muted-foreground" />
              <span className="cs-section-label">Anexos</span>
            </div>
            <SuggestionAttachments files={files} onFileChange={setFiles} />
          </div>
        </form>
      </div>

      <div className="cs-footer">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
          <p className="text-xs text-muted-foreground truncate">
            Será analisada pela moderação antes de ir à votação
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSuccess}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-suggestion-form"
            disabled={isSubmitting}
            size="sm"
            className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold min-w-[160px]"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar sugestão
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
