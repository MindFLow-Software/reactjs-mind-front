import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { TitleIcon } from '@/components/title-icon'
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'

type ProfileCardVariant = 'primary' | 'secondary'

function ProfileCardRoot({
  children,
  variant = 'primary',
}: {
  children: ReactNode
  variant?: ProfileCardVariant
}) {
  return (
    <div
      className={cn(
        "relative w-full h-full flex flex-col gap-6 py-6 overflow-hidden rounded-xl border border-border bg-card transition-colors duration-150 before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:content-['']",
        variant === 'primary'
          ? 'hover:bg-blue-50/50 dark:hover:bg-blue-950/10 before:bg-linear-to-r before:from-primary before:to-primary/50'
          : 'hover:bg-green-50/50 dark:hover:bg-green-950/10 before:bg-linear-to-r before:from-green-600 before:to-green-400',
      )}
    >
      {children}
    </div>
  )
}

type IProfileCardHeader = {
  label: string
  icon: ReactNode
  variant?: ProfileCardVariant
}

function ProfileCardHeader({
  label,
  icon,
  variant = 'primary',
}: IProfileCardHeader) {
  return (
    <CardHeader className="flex items-center pt-4">
      <TitleIcon variant={variant}>{icon}</TitleIcon>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </CardHeader>
  )
}

function ProfileCardContent({ children }: { children: ReactNode }) {
  return <CardContent className="space-y-2 flex-1">{children}</CardContent>
}

function ProfileCardFooter({ children }: { children: ReactNode }) {
  return <CardFooter className="pb-4 mt-auto">{children}</CardFooter>
}

export const ProfileCard = Object.assign(ProfileCardRoot, {
  Header: ProfileCardHeader,
  Content: ProfileCardContent,
  Footer: ProfileCardFooter,
})
