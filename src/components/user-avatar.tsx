import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

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

const avatarVariants = cva('border shrink-0 bg-muted', {
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

const fallbackVariants = cva('font-semibold', {
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

interface IUserAvatar extends VariantProps<typeof avatarVariants> {
  src?: string | null
  name: string | null
  className?: string
  showStatusRing?: boolean
  isActive?: boolean
  colorSeed?: string
}

export function UserAvatar({
  src,
  name,
  className,
  size,
  showStatusRing,
  isActive,
  colorSeed,
}: IUserAvatar) {
  const initials = useMemo(() => {
    if (!name) return <User />
    const parts = name.trim().split(/\s+/)
    return (
      parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')
    ).toUpperCase()
  }, [name])

  const color = useMemo(
    () => (colorSeed ? seedToColor(colorSeed) : null),
    [colorSeed],
  )

  const ringClass = showStatusRing
    ? isActive
      ? 'ring-2 ring-emerald-500 ring-offset-1'
      : 'ring-2 ring-muted-foreground/40 ring-offset-1'
    : undefined

  const url = src ?? undefined

  return (
    <Avatar className={cn(avatarVariants({ size }), ringClass, className)}>
      <AvatarImage src={url} className="object-cover" />
      <AvatarFallback
        className={cn(
          fallbackVariants({ size }),
          color
            ? `${color.bg} ${color.text} border-0`
            : 'text-muted-foreground',
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
