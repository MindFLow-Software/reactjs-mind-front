"use client"

import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { useHeaderStore } from "@/hooks/use-header-store"
import { getPendingApprovals } from "@/api/approvals"
import { ApprovalsTable } from "./components/approvals-table"

export function AdminApprovalsPage() {
    const { setTitle } = useHeaderStore()

    useEffect(() => {
        setTitle('Aprovações de Psicólogos')
    }, [setTitle])

    const { data, isLoading } = useQuery({
        queryKey: ["pending-approvals"],
        queryFn: getPendingApprovals,
        staleTime: 1000 * 60 * 10, // 10 minutos (dados de aprovação mudam pouco)
    })

    const psychologists = data?.psychologists ?? []

    return (
        <>
            <Helmet title="Aprovações de Psicólogos" />
            <div className="flex flex-col gap-6 mt-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Novas Solicitações</h1>
                    <p className="text-sm text-muted-foreground">
                        Verifique e aprove profissionais para acesso à plataforma.
                    </p>
                </div>

                <ApprovalsTable
                    psychologists={psychologists}
                    isLoading={isLoading}
                />
            </div>
        </>
    )
}