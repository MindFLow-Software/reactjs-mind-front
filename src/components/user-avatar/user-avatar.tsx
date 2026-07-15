import { useMemo } from 'react'
import { User } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Normalizer } from '@/utils/normalizer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import './user-avatar.css'

const AVATAR_PALETTE = [
  { bg: 'bg-blue-500', text: 'text-white' },
  { bg: 'bg-violet-500', text: 'text-white' },
  { bg: 'bg-emerald-500', text: 'text-white' },
  { bg: 'bg-amber-500', text: 'text-white' },
  { bg: 'bg-rose-500', text: 'text-white' },
  { bg: 'bg-sky-500', text: 'text-white' },
  { bg: 'bg-indigo-500', text: 'text-white' },
  { bg: 'bg-teal-500', text: 'text-white' },
  { bg: 'bg-orange-500', text: 'text-white' },
  { bg: 'bg-pink-500', text: 'text-white' },
]

function seedToColor(seed: string) {
  const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length]
}

const avatarVariants = cva('ua-avatar', {
  variants: {
    size: {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const fallbackVariants = cva('ua-fallback', {
  variants: {
    size: {
      sm: 'text-[10px]',
      md: 'text-xs',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type IUserAvatarIdentity = {
  src?: string | null
  name: string | null
  colorSeed?: string
}

type IUserAvatar = VariantProps<typeof avatarVariants> & {
  identity: IUserAvatarIdentity
  className?: string
}

export function UserAvatar({ identity, className, size }: IUserAvatar) {
  const { src, name, colorSeed } = identity

  const initials = useMemo(
    () => (name ? Normalizer.initials(name) : null),
    [name],
  )

  const color = useMemo(
    () => (colorSeed ? seedToColor(colorSeed) : null),
    [colorSeed],
  )

  const url = src ?? undefined

  return (
    <Avatar className={cn(avatarVariants({ size }), className)}>
      <AvatarImage src={url} className="ua-image" />
      <AvatarFallback
        className={cn(
          fallbackVariants({ size }),
          color
            ? cn('ua-fallback-colored', color.bg, color.text)
            : 'ua-fallback-default',
        )}
      >
        {initials ?? <User />}
      </AvatarFallback>
    </Avatar>
  )
}
