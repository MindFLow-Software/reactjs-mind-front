"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { Loader2, RefreshCw } from "lucide-react"

import { useHeaderStore } from "@/hooks/use-header-store"
import { getProfile } from "@/api/get-profile"
import { Button } from "@/components/ui/button"
import { PsychologistProfileCard } from "./components/psychologist-profile-card"
import { ActivityHeatmap } from "./components/activity-heatmap"

const stats = Array.from({ length: 52 * 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (52 * 7 - i))
    return {
        date: date.toISOString(),
        count: Math.floor(Math.random() * 6),
    }
})

export function MockPsychologistProfilePage() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Minha Conta')
    }, [setTitle])

    const { data: psychologist, isLoading, isError, refetch } = useQuery({
        queryKey: ["psychologist-profile-v2"],
        queryFn: getProfile,
        staleTime: 1000 * 60 * 5,
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="text-sm text-muted-foreground animate-pulse">Carregando seu perfil...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] gap-4 px-4 text-center">
                <div className="bg-destructive/10 p-4 rounded-full">
                    <p className="text-4xl">😕</p>
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold">Ops! Algo deu errado</h2>
                    <p className="text-muted-foreground">Não conseguimos carregar os dados da sua conta agora.</p>
                </div>
                <Button variant="outline" onClick={() => refetch()} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Tentar novamente
                </Button>
            </div>
        )
    }

    return (
        <>
            <Helmet title="Minha Conta" />

            <div className="flex flex-col gap-5 mt-6">
                {psychologist && (
                    <PsychologistProfileCard
                        psychologist={psychologist}
                    />
                )}

                <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 delay-150 duration-500">
                    <ActivityHeatmap data={stats} />
                </div>
            </div>
        </>
    )
}