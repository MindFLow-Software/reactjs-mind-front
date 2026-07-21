import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, X, Loader2, Save, MessageSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { SelectInput } from '@/components/form-fields/select-input/select-input'
import { TextareaInput } from '@/components/form-fields/textarea-input/textarea-input'
import {
  editSuggestionSchema,
  type EditSuggestionSchema,
} from '@/validators/suggestions/form/edit-suggestion-schema'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import type { SuggestionCategory } from '@/types/suggestion/suggestion-category'
import { SuggestionStatus } from '@/types/suggestion/suggestion-status'
import type { UpdateSuggestionParams } from '@/api/suggestions/update-suggestion-status'
import { translatedSuggestionCategory } from '@/constants/translated-suggestion-category'
import './edit-suggestion-form.css'

const CATEGORY_OPTIONS = (
  Object.entries(translatedSuggestionCategory) as [SuggestionCategory, string][]
).map(([value, label]) => ({ value, label }))

type EditSuggestionFormProps = {
  item: ISuggestion
  onUpdate: (data: UpdateSuggestionParams) => Promise<void>
  isUpdating: boolean
}

export function EditSuggestionForm({
  item,
  onUpdate,
  isUpdating,
}: EditSuggestionFormProps) {
  const methods = useForm<EditSuggestionSchema>({
    resolver: zodResolver(editSuggestionSchema),
    defaultValues: {
      title: item.title,
      category: item.category,
      description: item.description,
    },
  })

  const { handleSubmit } = methods

  const onSubmit = async (data: EditSuggestionSchema) => {
    await onUpdate({ id: item.id, ...data })
  }

  const onApprove = async (data: EditSuggestionSchema) => {
    await onUpdate({ id: item.id, ...data, status: SuggestionStatus.OPEN })
  }

  return (
    <Form {...methods}>
      <form className="ads-edit-form">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <MessageSquare className="size-5 text-primary" />
            Revisar Sugestão
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput<EditSuggestionSchema> name="title" label="Título" />
            <SelectInput<EditSuggestionSchema, SuggestionCategory>
              name="category"
              label="Categoria"
              options={CATEGORY_OPTIONS}
            />
          </div>

          <TextareaInput<EditSuggestionSchema>
            name="description"
            label="Conteúdo da Sugestão"
            className="ads-edit-textarea"
          />
        </div>

        <DialogFooter className="ads-edit-footer">
          <Button
            type="button"
            variant="outline"
            onClick={handleSubmit(onSubmit)}
            disabled={isUpdating}
            className="h-11 flex-1 rounded-xl font-bold"
          >
            <Save data-icon="inline-start" /> Salvar Edição
          </Button>

          <div className="flex flex-1 gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                onUpdate({ id: item.id, status: SuggestionStatus.REJECTED })
              }
              disabled={isUpdating}
              className="h-11 rounded-xl font-bold"
            >
              <X data-icon="inline-start" /> Rejeitar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit(onApprove)}
              disabled={isUpdating}
              className="ads-edit-approve-btn h-11"
            >
              {isUpdating ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <Check data-icon="inline-start" />
              )}
              Aprovar
            </Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  )
}
