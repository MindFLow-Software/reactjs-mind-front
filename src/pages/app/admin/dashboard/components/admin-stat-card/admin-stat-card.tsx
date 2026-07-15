import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import './admin-stat-card.css'

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
      <Card className={cn('adb-stat-card', `adb-stat-card--${accent}`)}>
        <div className="adb-stat-body">{children}</div>
      </Card>
    </AdminStatCardContext.Provider>
  )
}

function AdminStatCardHeader({ icon, title, subtitle }: IAdminStatCardHeader) {
  const accent = useContext(AdminStatCardContext)

  return (
    <div className="adb-stat-header">
      <div className={cn('adb-stat-icon', `adb-stat-icon--${accent}`)}>
        {icon}
      </div>

      <div className="adb-stat-heading">
        <span className="adb-stat-title">{title}</span>
        <span className="adb-stat-subtitle">{subtitle}</span>
      </div>
    </div>
  )
}

function AdminStatCardValue({ children }: IAdminStatCardValue) {
  return (
    <>
      <Separator className="adb-stat-separator" />
      <span className="adb-stat-value">{children}</span>
    </>
  )
}

export const AdminStatCard = Object.assign(AdminStatCardRoot, {
  Header: AdminStatCardHeader,
  Value: AdminStatCardValue,
})
