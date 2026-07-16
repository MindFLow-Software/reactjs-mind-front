import './pill-radio.css'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils'

export type IPillOption = {
  value: string
  label: string
  icon?: ElementType | null
  checkedCls?: string
}

type IPillRadio = {
  name: string
  options: readonly IPillOption[]
  selection: { value: string; onChange: (value: string) => void }
}

export function PillRadio({ name, options, selection }: IPillRadio) {
  return (
    <div className="rp-pill-radio">
      {options.map((option) => {
        const Icon = option.icon
        const checked = selection.value === option.value

        return (
          <label
            key={option.value}
            className={cn(
              'rp-pill-radio__label',
              checked
                ? (option.checkedCls ?? 'rp-pill-radio__label--checked')
                : 'rp-pill-radio__label--unchecked',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => selection.onChange(option.value)}
              className="sr-only"
            />
            {Icon && <Icon className="rp-pill-radio__icon" />}
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
