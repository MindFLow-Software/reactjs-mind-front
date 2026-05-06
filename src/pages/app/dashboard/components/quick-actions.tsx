"use client"

import { UserPlus, CalendarPlus, FileText, Video } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ActionItem {
    icon: React.ElementType
    title: string
    subtitle: string
    href: string
    iconClass: string
}

const ACTIONS: ActionItem[] = [
    {
        icon: UserPlus,
        title: 'Novo paciente',
        subtitle: 'Cadastrar',
        href: '/patients-list',
        iconClass: 'text-blue-500',
    },
    {
        icon: CalendarPlus,
        title: 'Agendar',
        subtitle: 'Nova sessão',
        href: '/appointment',
        iconClass: 'text-blue-500',
    },
    {
        icon: FileText,
        title: 'Anamnese',
        subtitle: 'Nova',
        href: '/patients-docs',
        iconClass: 'text-blue-500',
    },
    {
        icon: Video,
        title: 'Sala',
        subtitle: 'Iniciar',
        href: '/video-room',
        iconClass: 'text-blue-500',
    },
]

export function QuickActions() {
    const navigate = useNavigate()

    return (
        <Card className="border-border bg-card shadow-sm rounded-2xl">
            <CardHeader className="pb-3 px-5 pt-5">
                <CardTitle className="text-base font-semibold text-foreground">Ações rápidas</CardTitle>
                <p className="text-xs text-muted-foreground">Atalhos</p>
            </CardHeader>
            <CardContent className="px-5 pb-5">
                <div className="grid grid-cols-2 gap-2">
                    {ACTIONS.map(({ icon: Icon, title, subtitle, href, iconClass }) => (
                        <button
                            key={title}
                            onClick={() => navigate(href)}
                            className={cn(
                                "flex items-center gap-3 rounded-xl border border-border bg-background p-3.5 cursor-pointer",
                                "text-left transition-colors hover:bg-muted/50 active:bg-muted"
                            )}
                        >
                            <Icon className={cn("size-5 shrink-0", iconClass)} />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
                                <p className="text-xs text-muted-foreground">{subtitle}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
