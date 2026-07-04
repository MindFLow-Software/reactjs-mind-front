'use client'

import * as React from 'react'
import { Brain, ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import './team-switcher.css'

interface TeamSwitcherTeam {
  name: string
  firstName: string
  lastName: string
  logo: React.ElementType
  plan: string
}

interface TeamSwitcherProps {
  teams: TeamSwitcherTeam[]
  isLoading: boolean
}

export function TeamSwitcher({ teams, isLoading }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  React.useEffect(() => {
    if (teams.length > 0) {
      setActiveTeam(teams[0])
    }
  }, [teams])

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="ts-skeleton-wrap">
            <Skeleton className="ts-skeleton" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!activeTeam) {
    return null
  }

  const fullName = `${activeTeam.firstName} ${activeTeam.lastName}`

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="ts-logo text-sidebar-primary-foreground">
                <Brain size={32} className="ts-brand-icon" />
              </div>
              <div className="ts-info">
                <span className="ts-name">{fullName}</span>
                <span className="ts-plan">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="ts-content w-[--radix-dropdown-menu-trigger-width]"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="ts-group-label">
              Equipes
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="ts-item"
              >
                <div className="ts-item-logo">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.firstName} {team.lastName}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="ts-item">
              <div className="ts-add-logo">
                <Plus className="size-4" />
              </div>
              <div className="ts-add-label">Adicionar equipe</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
