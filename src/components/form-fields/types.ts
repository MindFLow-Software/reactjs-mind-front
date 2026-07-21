import type { FieldPath, FieldValues } from 'react-hook-form'

export type IFormFieldBaseProps<
  TFieldValues extends FieldValues = FieldValues,
> = {
  name: FieldPath<TFieldValues>
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
}
