import { useEffect, useRef } from 'react'
import { Loader2, Search, X } from 'lucide-react'

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

import './search-input.css'

type ISearchInput = {
  value: string
  onChange: (value: string) => void
  onDebouncedChange?: (value: string) => void
  debounceMs?: number
  placeholder?: string
  isLoading?: boolean
  className?: string
}

export function SearchInput({
  value,
  onChange,
  onDebouncedChange,
  debounceMs = 400,
  placeholder,
  isLoading = false,
  className,
}: ISearchInput) {
  const { debounce } = useDebounce()
  const isFirstRunRef = useRef(true)

  useEffect(() => {
    if (isFirstRunRef.current) {
      isFirstRunRef.current = false
      return
    }
    if (!onDebouncedChange) return

    debounce(() => onDebouncedChange(value), debounceMs)
  }, [value, debounceMs, onDebouncedChange, debounce])

  function handleClear() {
    isFirstRunRef.current = true
    onChange('')
    onDebouncedChange?.('')
  }

  return (
    <InputGroup className={cn('si-root', className)}>
      <InputGroupAddon>
        {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label="Limpar busca"
            onClick={handleClear}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
