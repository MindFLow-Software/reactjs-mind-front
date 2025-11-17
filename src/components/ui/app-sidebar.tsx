"use client"

import * as React from "react"
import {
    BrainCircuit,
    Clock,
    GalleryVerticalEnd,
    Home,
    Map,
    Users2,
    Wallet,
    CalendarCheck,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "./sidebar"
import { useQuery } from "@tanstack/react-query" // 🔑 Importar useQuery
import { getProfile, type GetProfileResponse } from "@/api/get-profile" // 🔑 Importar API de perfil
import { Skeleton } from "@/components/ui/skeleton" // Para estado de carregamento

const navMain = [
    {
        title: "Home",
        url: "#",
        icon: Home,
        isActive: false,
        items: [
            { title: "Dashboard", url: "/" },
        ],
    },
    {
        title: "Pacientes",
        url: "#",
        icon: Users2,
        items: [
            { title: "Listagem de Pacientes", url: "/patients-list" },
            { title: "Criar Agendamento", url: "/appointment" },
        ],
    },
    {
        title: "Agendamentos",
        url: "#",
        icon: CalendarCheck,
        items: [
            { title: "Meus Agendamentos", url: "/" },
            { title: "Sala de Atendimento", url: "/video-room" },
            { title: "Histórico de Sessões", url: "/sessions/history" },
        ],
    },
    {
        title: "Financeiro",
        url: "#",
        icon: Wallet,
        items: [
            { title: "Pagamentos", url: "#" },
            { title: "Planos e Assinaturas", url: "#" },
            { title: "Saques", url: "#" },
            { title: "Cobrança", url: "#" },
        ],
    },
]

const projects = [
    { name: "Pomodoro", url: "#", icon: Clock },
    {
        name: "ChatBot MindFLush",
        url: "https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/10/13/22/20251013223819-5VEK1PGJ.json",
        icon: BrainCircuit,
    },
    { name: "Travel", url: "#", icon: Map },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    
    // 1. 🔍 Fetch do perfil logado
    const { data: profile, isLoading } = useQuery<GetProfileResponse | null>({
        queryKey: ["psychologist-profile"],
        queryFn: getProfile,
        retry: false,
    })

    const teams = React.useMemo(() => {
        if (!profile) {
            return [
                {
                    name: isLoading ? "Carregando..." : "Sem perfil",
                    firstName: "...",
                    lastName: "...",
                    plan: "Básico",
                    logo: GalleryVerticalEnd,
                },
            ]
        }

        // Mapeia os dados reais do psicólogo
        return [
            {
                name: "Clínica MindFlow", 
                firstName: profile.firstName,
                lastName: profile.lastName,
                logo: GalleryVerticalEnd,
                plan: "Plano Enterprise", // Idealmente, buscaria o plano do objeto 'profile'
            },
        ]
    }, [profile, isLoading])

    if (isLoading) {
        return (
            <Sidebar collapsible="icon" {...props}>
                <SidebarHeader>
                    <Skeleton className="w-full h-14 rounded-xl" />
                </SidebarHeader>
                <SidebarContent>
                    <Skeleton className="w-full h-96 rounded-xl mt-4" />
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
        )
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={teams} />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navMain} />
                <NavProjects projects={projects} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}