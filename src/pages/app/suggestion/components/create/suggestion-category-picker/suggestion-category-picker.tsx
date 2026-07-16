'use client'

import { cn } from '@/lib/utils'
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
    <div className="grid grid-cols-3 gap-2.5">
      {CREATE_SUGGESTION_CATEGORIES.map((cat) => {
        const Icon = cat.icon
        const isSelected = value === cat.value
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={cn(
              'cs-category',
              isSelected ? 'cs-category--selected' : 'cs-category--default',
            )}
          >
            <div className={cn('cs-category-icon', cat.iconBg)}>
              <Icon className={cn('size-4', cat.iconColor)} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p
                className={cn(
                  'text-xs font-semibold leading-tight',
                  isSelected
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-foreground',
                )}
              >
                {cat.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {cat.description}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
