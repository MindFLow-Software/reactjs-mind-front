import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import './session-format-toggle.css'

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
  function handleValueChange(next: string) {
    if (next) {
      onChange(next as T)
    }
  }

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={handleValueChange}
      className="pc-segm"
    >
      {options.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value}>
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
