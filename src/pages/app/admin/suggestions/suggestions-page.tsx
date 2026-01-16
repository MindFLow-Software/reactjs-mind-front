"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import {
    LayoutGrid
} from "lucide-react"

import { useHeaderStore } from "@/hooks/use-header-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { MostVotedSuggestionsCard } from "./components/most-voted-suggestions-card"
import { PendingSuggestionsModeration } from "./components/pending-suggestions-moderation"
import { SuggestionRanking } from "./components/ranking-table"

export function AdminSuggestionsPage() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Painel de Sugestões')
    }, [setTitle])


    return (
        <>
            <Helmet title="Sugestões e Sugestões" />

            <div className="flex flex-col gap-8 mt-6">
                <div>
                    <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg rounded-2xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-3">
                                <span className="flex items-center justify-center size-8 rounded-full bg-white/20">
                                    <LayoutGrid className="size-4" />
                                </span>
                                Priorização de Sugestões
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-xs leading-relaxed text-white/90">
                                As sugestões mais votadas representam demandas reais dos psicólogos.
                                Priorize-as movendo para{" "}
                                <span className="font-semibold text-white underline underline-offset-2">
                                    Em Análise
                                </span>{" "}
                                para notificar automaticamente os autores.
                            </p>
                        </CardContent>
                    </Card>
                </div>


                <div className="grid grid-cols-1 gap-6">
                    <div className="col-span-12 lg:col-span-8">
                        <PendingSuggestionsModeration />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className=" space-y-6">
                        <MostVotedSuggestionsCard />
                    </div>
                    <div className=" space-y-6">
                        <SuggestionRanking />
                    </div>
                </div>

            </div>
        </>
    )
}