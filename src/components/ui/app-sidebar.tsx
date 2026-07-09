'use client'
// No paired CSS: composition-only shell over shadcn Sidebar + nav config, no feature styling.
import * as React from 'react'

import { useAuth } from '@/hooks/use-auth'

import {
  Home,
  Inbox,
  Wallet,
  Users2,
  HeartPlus,
  ShieldCheck,
  CalendarCheck,
  GalleryVerticalEnd,
} from 'lucide-react'

import {
  Sidebar,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar'

import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { useActivePracticeContextStore } from '@/store/use-active-practice-context-store'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, isPending } = useAuth()
  const { activePracticeContextId } = useActivePracticeContextStore()

  const filteredNavMain = React.useMemo(() => {
    const isAdmin = profile?.platformRole === 'ADMIN'
    const isLoggedAsPsychologist = Boolean(activePracticeContextId)

    // 1. Itens que AMBOS veem (mas com URLs diferentes no dashboard)
    const baseNav = [
      {
        title: 'Home',
        url: '#',
        icon: Home,
        items: [
          {
            title: 'Dashboard',
            url: isAdmin ? '/admin/dashboard' : '/dashboard',
          },
        ],
      },
    ]

    // 2. Itens exclusivos do PSICÓLOGO
    if (isLoggedAsPsychologist) {
      baseNav.push(
        {
          title: 'Pacientes',
          url: '#',
          icon: Users2,
          items: [
            { title: 'Cadastro de Pacientes', url: '/patients-list' },
            { title: 'Gestão de Documentos', url: '/patients-docs' },
            { title: 'Prontuários de Pacientes', url: '/patients-records' },
            {
              title: 'Solicitações de vínculo',
              url: '/patient-profiles/claim-requests',
            },
          ],
        },
        {
          title: 'Agendamentos',
          url: '#',
          icon: CalendarCheck,
          items: [
            { title: 'Meus Agendamentos', url: '/appointment' },
            { title: 'Horários de Atendimento', url: '/availability' },
            { title: 'Histórico de Sessões', url: '#' },
          ],
        },
        {
          title: 'Atendimento',
          url: '#',
          icon: HeartPlus,
          items: [{ title: 'Sala de Atendimento', url: '/video-room' }],
        },
        {
          title: 'Financeiro',
          url: '#',
          icon: Wallet,
          items: [
            { title: 'Pagamentos', url: '/dashboard-finance' },
            { title: 'Cobrança', url: '#' },
            { title: 'Cupons', url: '#' },
            { title: 'Saques', url: '#' },
          ],
        },
        {
          title: 'Sugestões e Feedback',
          url: '#',
          icon: Inbox,
          items: [{ title: 'Enviar Sugestão', url: '/suggestion' }],
        },
      )
    }

    // 3. Itens exclusivos do ADMIN
    if (isAdmin) {
      baseNav.push({
        title: 'Administração',
        url: '#',
        icon: ShieldCheck,
        items: [{ title: 'Visão Geral Admin', url: '/admin/dashboard' }],
      })

      baseNav.push({
        title: 'Gestão de Usuários',
        url: '#',
        icon: Users2,
        items: [
          { title: 'Todos os Psicólogos', url: '/admin/psychologists' },
          { title: 'Todos os Pacientes', url: '/admin/patients' },
        ],
      })

      baseNav.push({
        title: 'Financeiro MindFlush',
        url: '#',
        icon: Wallet,
        items: [
          { title: 'Assinaturas Ativas', url: '/admin/subscriptions' },
          { title: 'Relatório de Repasses', url: '/admin/payouts' },
        ],
      })

      baseNav.push({
        title: 'Plataforma',
        url: '#',
        icon: Inbox,
        items: [
          { title: 'Sugestões Recebidas', url: 'admin-suggestions' },
          { title: 'Controle de Sugestões', url: 'management-suggestions' },
        ],
      })
    }

    return baseNav
  }, [profile, activePracticeContextId])

  const teams = React.useMemo(() => {
    const baseProfile = profile || {
      firstName: '...',
      lastName: '...',
      email: '...',
    }

    const isRoot = profile?.platformRole === 'ADMIN'

    return [
      {
        name: isRoot ? 'MindFlow Admin' : 'Clínica MindFlow',
        firstName: baseProfile.firstName,
        lastName: baseProfile.lastName,
        logo: GalleryVerticalEnd,
        plan: isRoot ? 'Acesso Root' : 'Plano Enterprise',
      },
    ]
  }, [profile])

  return (
    <Sidebar collapsible="icon" {...props} className="bg-white! z-100!">
      <SidebarHeader>
        <TeamSwitcher teams={teams} isLoading={isPending} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
