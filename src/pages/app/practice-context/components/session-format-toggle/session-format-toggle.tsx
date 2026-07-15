import './session-format-toggle.css'

import { cn } from '@/lib/utils'

type ISessionFormatToggleOption<T extends string> = {
  value: T
  label: string
}

type ISessionFormatToggle<T extends string> = {
  options: readonly ISessionFormatToggleOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function SessionFormatToggle<T extends string>({
  options,
  value,
  onChange,
}: ISessionFormatToggle<T>) {
  return (
    <div className="pc-segm" role="group">
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn('pc-segm-btn', active && 'pc-segm-btn--active')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
