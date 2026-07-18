import type { FieldValues } from 'react-hook-form'
import { useFormContext } from 'react-hook-form'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import type { IFormFieldBaseProps } from '../types'

import './select-input.css'

type ISelectOption<TValue extends string> = {
  value: TValue
  label: string
}

type ISelectInputProps<
  TFieldValues extends FieldValues,
  TValue extends string,
> = IFormFieldBaseProps<TFieldValues> & {
  options: readonly ISelectOption<TValue>[]
  className?: string
}

export function SelectInput<
  TFieldValues extends FieldValues,
  TValue extends string,
>({
  name,
  label,
  description,
  placeholder,
  disabled,
  options,
  className,
}: ISelectInputProps<TFieldValues, TValue>) {
  const { control } = useFormContext<TFieldValues>()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            value={field.value ?? undefined}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn('sli-trigger', className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
