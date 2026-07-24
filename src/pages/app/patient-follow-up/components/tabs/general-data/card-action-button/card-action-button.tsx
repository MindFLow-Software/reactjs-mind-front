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
        size="sm"
        disabled
        type="button"
        variant="ghost"
        onClick={onClick}
        className="cab-btn cab-edit"
      >
        {icon}
        {label}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      disabled
      type="button"
      variant="ghost"
      onClick={onClick}
      className="cab-btn cab-add"
    >
      <Plus className="size-3.5" />
      {label}
    </Button>
  )
}
