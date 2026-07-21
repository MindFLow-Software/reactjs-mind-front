import {
  Sun,
  Bell,
  Moon,
  LogOut,
  Laptop,
  Palette,
  Sparkles,
  CreditCard,
  BadgeCheck,
  ChevronsUpDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { useTheme } from '../theme/theme-provider'
import { useSignOut } from '@/hooks/use-sign-out'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'

import {
  useSidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import type { IMeResponse } from '@/types/me/me-response'

import './nav-user.css'

// TODO: verify how ADMIN and SUPPORT users going to resolve their profile images
function resolveAvatarImage(profile: IMeResponse | undefined): string | null {
  const { activePracticeContextId } = useActivePracticeContextStore()

  const activePracticeContext =
    profile?.practiceContexts.find(({ id }) => id === activePracticeContextId)

  if (activePracticeContext) return profile?.psychologistProfile?.profileImageUrl ?? null

  // TODO: get correct active patient profile
  return profile?.patientProfiles?.[0]?.profileImageUrl ?? null
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { setTheme } = useTheme()

  const { profile, isError, isPending: isLoading } = useAuth()

  const { signOut, isSigningOut } = useSignOut()

  let name = 'Carregando...'
  if (profile) name = `${profile.firstName} ${profile.lastName}`
  else if (isError) name = 'Erro ao carregar'

  const profileImage = resolveAvatarImage(profile)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              disabled={isLoading}
              className="nu-trigger data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {isLoading ? (
                <Skeleton className="nu-avatar-skeleton" />
              ) : (
                <UserAvatar
                  identity={{ src: profileImage, name }}
                  size="md"
                  className="nu-avatar"
                />
              )}

              <div className="nu-info">
                {isLoading ? (
                  <div className="nu-skeleton-stack">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ) : (
                  <>
                    <span className="nu-name">{name}</span>
                    <span className="nu-email">
                      {profile?.email || 'Sem e-mail'}
                    </span>
                  </>
                )}
              </div>

              {!isLoading && <ChevronsUpDown className="nu-chevron" />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {!isLoading && profile && (
            <DropdownMenuContent
              className="nu-content w-[--radix-dropdown-menu-trigger-width]"
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="nu-label">
                <div className="nu-label-inner">
                  <UserAvatar
                    identity={{ src: profileImage, name }}
                    size="md"
                    className="nu-avatar"
                  />
                  <div className="nu-info">
                    <span className="nu-name">{name}</span>
                    <span className="nu-email">{profile.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/planos" className="cursor-pointer">
                    <Sparkles className="nu-item-icon" />
                    Planos
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <Palette className="nu-item-icon" />
                    <span>Tema</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => setTheme('light')}
                        className="cursor-pointer"
                      >
                        <Sun className="nu-item-icon" />
                        <span>Claro</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme('dark')}
                        className="cursor-pointer"
                      >
                        <Moon className="nu-item-icon" />
                        <span>Escuro</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTheme('system')}
                        className="cursor-pointer"
                      >
                        <Laptop className="nu-item-icon" />
                        <span>Sistema</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <BadgeCheck className="nu-item-icon" />
                    Conta
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/pagamentos" className="cursor-pointer">
                    <CreditCard className="nu-item-icon" />
                    Pagamentos
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer">
                  <Bell className="nu-item-icon" />
                  Notificações
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={isSigningOut}
                className="nu-signout"
                onClick={() => signOut()}
              >
                <LogOut className="nu-item-icon" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
