import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  CREATE_SUGGESTION_CATEGORIES,
  type SuggestionCategoryValue,
} from '../create-suggestion-constants'
import './suggestion-category-picker.css'

type ISuggestionCategoryPicker = {
  value?: SuggestionCategoryValue
  onChange: (value: SuggestionCategoryValue) => void
}

export function SuggestionCategoryPicker({
  value,
  onChange,
}: ISuggestionCategoryPicker) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as SuggestionCategoryValue)}
      className="grid grid-cols-3 gap-2.5"
    >
      {CREATE_SUGGESTION_CATEGORIES.map((cat) => {
        const Icon = cat.icon
        const isSelected = value === cat.value

        return (
          <Label
            key={cat.value}
            className={cn(
              'cs-category',
              isSelected ? 'cs-category--selected' : 'cs-category--default',
            )}
          >
            <RadioGroupItem value={cat.value} className="sr-only" />
            <div className={cn('cs-category-icon', cat.iconBg)}>
              <Icon className={cn('size-4', cat.iconColor)} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p
                className={cn(
                  'text-xs font-semibold leading-tight',
                  isSelected ? 'text-primary' : 'text-foreground',
                )}
              >
                {cat.label}
              </p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {cat.description}
              </p>
            </div>
          </Label>
        )
      })}
    </RadioGroup>
  )
}
