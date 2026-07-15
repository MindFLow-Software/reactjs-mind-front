import { cn } from '@/lib/utils'
import { Normalizer } from '@/utils/normalizer'

import './suggestion-initials-avatar.css'

type ISuggestionAvatarSize = 'sm' | 'md' | 'lg'

type ISuggestionInitialsAvatar = {
  name: string | null
  size: ISuggestionAvatarSize
  className?: string
}

const SIZE_CLASS: Record<ISuggestionAvatarSize, string> = {
  sm: 'sia-avatar-sm',
  md: 'sia-avatar-md',
  lg: 'sia-avatar-lg',
}

export function SuggestionInitialsAvatar({
  name,
  size,
  className,
}: ISuggestionInitialsAvatar) {
  return (
    <div className={cn('sia-avatar', SIZE_CLASS[size], className)}>
      {Normalizer.initials(name)}
    </div>
  )
}
