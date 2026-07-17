import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import './card-action-button.css'

type ICardActionButton = {
  label: string
  icon?: React.ReactNode
  variant?: 'add' | 'edit'
  onClick?: () => void
}

export function CardActionButton({
  label,
  icon,
  variant = 'add',
  onClick,
}: ICardActionButton) {
  if (variant === 'edit') {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClick}
        disabled={!onClick}
        className="cab-edit"
      >
        {icon}
        {label}
      </Button>
    )
  }

  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="cab-add"
    >
      <Plus className="size-3.5" />
      {label}
    </Button>
  )
}
