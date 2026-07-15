import './patients-search-input.css'
import { Search } from 'lucide-react'
import type { ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type IPatientsSearchInput = ComponentProps<typeof Input> & {
  wrapperClassName?: string
}

export function PatientsSearchInput({
  wrapperClassName,
  className,
  ...props
}: IPatientsSearchInput) {
  return (
    <div className={cn('psi-wrapper', wrapperClassName)}>
      <Search className="psi-icon" />
      <Input {...props} className={cn('psi-input', className)} />
    </div>
  )
}
