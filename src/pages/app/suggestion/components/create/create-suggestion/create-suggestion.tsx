import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2, Lightbulb, FileText, Paperclip } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { IconBox } from '@/components/icon-box/icon-box'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { TextareaInput } from '@/components/form-fields/textarea-input/textarea-input'
import { cn } from '@/lib/utils'
import {
  createSuggestionSchema,
  type CreateSuggestionSchema,
} from '@/validators/suggestions/form/create-suggestion-schema'
import { SuggestionAttachments } from '../suggestion-attachments/suggestion-attachments'
import { SuggestionSuccessDialog } from '../suggestion-success-dialog/suggestion-success-dialog'
import { SuggestionCategoryPicker } from '../suggestion-category-picker/suggestion-category-picker'
import { SUGGESTION_DESCRIPTION_MIN } from '../create-suggestion-constants'
import { useCreateSuggestion } from '../hooks/use-create-suggestion'
import './create-suggestion.css'

type ICreateSuggestion = {
  onSuccess: () => void
}

export function CreateSuggestion({ onSuccess }: ICreateSuggestion) {
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const methods = useForm<CreateSuggestionSchema>({
    resolver: zodResolver(createSuggestionSchema),
    defaultValues: { description: '' },
  })

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = methods

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
      <SuggestionSuccessDialog
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
    <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
      <DialogHeader className="shrink-0 border-b px-6 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <IconBox icon={Lightbulb} variant="primary" size="md" />
          <div>
            <DialogTitle className="text-left text-lg font-bold">
              Nova sugestão
            </DialogTitle>
            <DialogDescription className="text-left text-sm">
              Descreva sua ideia em detalhes — quanto mais clara, mais rápido a
              comunidade entende e vota.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
        <div className="cs-hint">
          <div className="cs-hint-badge">
            <span className="text-[10px] font-extrabold text-primary">i</span>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">
              Antes de enviar, dê uma olhada no board
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sua ideia pode já existir. Se encontrar algo parecido, prefira{' '}
              <strong>dar um voto</strong> na sugestão existente — assim ela
              ganha mais força.
            </p>
            <div className="cs-hint-pill">
              <span className="font-bold text-primary">✓</span>
              Mínimo de {SUGGESTION_DESCRIPTION_MIN} caracteres no detalhamento
            </div>
          </div>
        </div>

        <Form {...methods}>
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

              <TextInput<CreateSuggestionSchema>
                name="title"
                label="Título"
                placeholder="Resuma sua ideia em uma frase curta"
              />

              <div className="flex flex-col gap-2">
                <Label
                  className={cn(
                    'text-sm font-medium',
                    errors.category && 'text-destructive',
                  )}
                >
                  Categoria <span className="text-destructive">*</span>
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

            <div className="flex flex-col gap-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-3.5 text-muted-foreground" />
                  <span className="cs-section-label">Detalhamento</span>
                </div>
                <span
                  className={cn(
                    'cs-counter',
                    descriptionValue.length < SUGGESTION_DESCRIPTION_MIN
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-success/10 text-success',
                  )}
                >
                  {descriptionValue.length} / {SUGGESTION_DESCRIPTION_MIN}
                </span>
              </div>
              <TextareaInput<CreateSuggestionSchema>
                name="description"
                placeholder="Descreva detalhadamente o que você imaginou..."
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-3 border-t pt-4">
              <div className="flex items-center gap-2">
                <Paperclip className="size-3.5 text-muted-foreground" />
                <span className="cs-section-label">Anexos</span>
              </div>
              <SuggestionAttachments files={files} onFileChange={setFiles} />
            </div>
          </form>
        </Form>
      </div>

      <div className="cs-footer">
        <div className="flex min-w-0 items-center gap-2">
          <div className="size-2 shrink-0 rounded-full bg-success" />
          <p className="truncate text-xs text-muted-foreground">
            Será analisada pela moderação antes de ir à votação
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="create-suggestion-form"
            disabled={isSubmitting}
            size="sm"
            className="min-w-[160px]"
          >
            {isSubmitting ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <>
                <Send data-icon="inline-start" />
                Enviar sugestão
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
