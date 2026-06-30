import type { ReactNode } from 'react'

import { TitleIcon } from '@/components/title-icon'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

function ProfileCardRoot({ children }: { children: ReactNode }) {
  return (
    <Card className="relative overflow-hidden max-w-1/2 w-full max-h-96 p-0 gap-3">
      {children}
    </Card>
  )
}

type IProfileCardHeader = {
  label: string
  icon: ReactNode
  variant?: 'primary' | 'secondary'
}

function ProfileCardHeader({ label, icon, variant = 'primary' }: IProfileCardHeader) {
  return (
    <CardHeader className="flex items-center pt-4">
      <div className={`absolute inset-x-0 top-0 h-1 ${variant === 'primary' ? 'bg-blue-600' : 'bg-teal-600'}`} />
      <TitleIcon variant={variant}>
        {icon}
      </TitleIcon>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </CardHeader>
  )
}

function ProfileCardContent({ children }: { children: ReactNode }) {
  return (
    <CardContent className="space-y-2">{children}</CardContent>
  )
}

function ProfileCardFooter({ children }: { children: ReactNode }) {
  return <CardFooter className="pb-4 mt-auto">{children}</CardFooter>
}

export const ProfileCard = {
  Root: ProfileCardRoot,
  Header: ProfileCardHeader,
  Content: ProfileCardContent,
  Footer: ProfileCardFooter,
}
