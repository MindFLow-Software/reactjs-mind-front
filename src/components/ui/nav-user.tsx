'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  Moon,
  Sun,
  Laptop,
  Palette,
} from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'

import { signOut } from '@/api/auth/sign-out'
import {
  getProfile,
  type IgetMeResponse,
} from '@/api/psychologists/get-profile'
import { useTheme } from '../theme/theme-provider'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/user-avatar'
import { useSessionStore } from '@/store/use-session-store'
import './nav-user.css'

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const queryClient = useQueryClient()
  const clearSession = useSessionStore((state) => state.clearSession)

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<IgetMeResponse | null>({
    queryKey: ['user-profile'],
    queryFn: getProfile,
    retry: false,
    staleTime: Infinity,
  })

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      clearSession()
      queryClient.clear()
      toast.success('Sessão encerrada com segurança!', { duration: 4000 })
      navigate('/sign-in', { replace: true })
    },
    onError: (error) => {
      console.error('Erro ao sair:', error)
      clearSession()
      navigate('/sign-in', { replace: true })
    },
  })

  const name = profile
    ? `${profile.firstName} ${profile.lastName}`
    : isError
      ? 'Erro ao carregar'
      : 'Carregando...'

  const profileImage = profile?.profileImageUrl || null

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
                  src={profileImage}
                  name={name}
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
                    src={profileImage}
                    name={name}
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
                onClick={() => signOutFn()}
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
