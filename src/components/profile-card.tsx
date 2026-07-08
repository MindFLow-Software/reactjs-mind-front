import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { TitleIcon } from '@/components/title-icon'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import './profile-card.css'

function ProfileCardRoot({ children }: { children: ReactNode }) {
  return <Card className="pf-card-root">{children}</Card>
}

type IProfileCardHeader = {
  label: string
  icon: ReactNode
  variant?: 'primary' | 'secondary'
}

function ProfileCardHeader({
  label,
  icon,
  variant = 'primary',
}: IProfileCardHeader) {
  return (
    <CardHeader className="pf-card-header">
      <div
        className={cn(
          'pf-card-accent-bar',
          variant === 'primary'
            ? 'pf-card-accent-bar--primary'
            : 'pf-card-accent-bar--secondary',
        )}
      />
      <TitleIcon variant={variant}>{icon}</TitleIcon>
      <span className="pf-card-header-label">{label}</span>
    </CardHeader>
  )
}

function ProfileCardContent({ children }: { children: ReactNode }) {
  return <CardContent className="pf-card-content">{children}</CardContent>
}

function ProfileCardFooter({ children }: { children: ReactNode }) {
  return <CardFooter className="pf-card-footer">{children}</CardFooter>
}

export const ProfileCard = Object.assign(ProfileCardRoot, {
  Header: ProfileCardHeader,
  Content: ProfileCardContent,
  Footer: ProfileCardFooter,
})
