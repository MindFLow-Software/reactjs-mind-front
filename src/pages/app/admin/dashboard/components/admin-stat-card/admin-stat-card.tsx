import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { MetricCard } from '@/components/metric-card/metric-card'

export enum AdminStatAccent {
  RED = 'red',
  BLUE = 'blue',
  AMBER = 'amber',
}

const AdminStatCardContext = createContext<AdminStatAccent>(
  AdminStatAccent.BLUE,
)

type IAdminStatCardRoot = {
  accent: AdminStatAccent
  children: ReactNode
}

type IAdminStatCardHeader = {
  icon: ReactNode
  title: string
  subtitle: string
}

type IAdminStatCardValue = {
  children: ReactNode
}

function AdminStatCardRoot({ accent, children }: IAdminStatCardRoot) {
  return (
    <AdminStatCardContext.Provider value={accent}>
      <MetricCard variant="stacked" accentColor={accent}>
        {children}
      </MetricCard>
    </AdminStatCardContext.Provider>
  )
}

function AdminStatCardHeader({ icon, title, subtitle }: IAdminStatCardHeader) {
  const accent = useContext(AdminStatCardContext)

  return (
    <MetricCard.Header
      icon={icon}
      label={title}
      subtitle={subtitle}
      accentColor={accent}
    />
  )
}

function AdminStatCardValue({ children }: IAdminStatCardValue) {
  return <MetricCard.Value>{children}</MetricCard.Value>
}

export const AdminStatCard = Object.assign(AdminStatCardRoot, {
  Header: AdminStatCardHeader,
  Value: AdminStatCardValue,
})
