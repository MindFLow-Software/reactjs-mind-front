'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  X,
  Loader2,
  Save,
  MessageSquare,
  Tag,
  FileText,
} from 'lucide-react'

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
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  editSuggestionSchema,
  type EditSuggestionSchema,
} from '@/validators/suggestions/form/edit-suggestion-schema'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import type { UpdateSuggestionParams } from '@/api/suggestions/update-suggestion-status'
import { translatedSuggestionCategory } from '@/constants/translated-suggestion-category'
import './edit-suggestion-form.css'

const editSchema = editSuggestionSchema
type EditSchema = EditSuggestionSchema

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
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditSchema>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      title: item.title,
      category: item.category,
      description: item.description,
    },
  })

  const onSubmit = async (data: EditSchema) => {
    await onUpdate({ id: item.id, ...data })
  }

  const onApprove = async (data: EditSchema) => {
    await onUpdate({ id: item.id, ...data, status: 'OPEN' })
  }

  return (
    <form className="ads-edit-form">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="size-5 text-primary" />
          Revisar Sugestão
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="ads-edit-label">
              <FileText className="size-3" /> Título
            </Label>
            <Input {...register('title')} />
            {errors.title && (
              <span className="ads-edit-error">{errors.title.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="ads-edit-label">
              <Tag className="size-3" /> Categoria
            </Label>
            <Select
              defaultValue={item.category}
              onValueChange={(v) =>
                setValue('category', v as EditSuggestionSchema['category'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(translatedSuggestionCategory).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="ads-edit-label">Conteúdo da Sugestão</Label>
          <Textarea
            {...register('description')}
            className="ads-edit-textarea"
          />
        </div>
      </div>

      <DialogFooter className="ads-edit-footer">
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit(onSubmit)}
          disabled={isUpdating}
          className="flex-1 rounded-xl font-bold h-11"
        >
          <Save className="size-4 mr-2" /> Salvar Edição
        </Button>

        <div className="flex flex-1 gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={() => onUpdate({ id: item.id, status: 'REJECTED' })}
            disabled={isUpdating}
            className="rounded-xl font-bold h-11"
          >
            <X className="size-4 mr-2" /> Rejeitar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onApprove)}
            disabled={isUpdating}
            className="ads-edit-approve-btn h-11"
          >
            {isUpdating ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <Check className="size-4 mr-2" />
            )}
            Aprovar
          </Button>
        </div>
      </DialogFooter>
    </form>
  )
}
