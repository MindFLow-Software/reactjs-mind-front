import { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { UsersRound, Activity, UserRoundPlus, QrCode, Clock, TrendingUp } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"

import { Pagination } from "@/components/pagination"
import { PatientsTableFilters } from "./components/patients-table-filters"
import { PatientsTable } from "./components/patients-table"

import { useHeaderStore } from "@/hooks/use-header-store"
import { usePatientFilters } from "@/hooks/use-patient-filters"
import { getPatients } from "@/api/get-patients"
import { PatientsDataBlock } from "../components/patients-data-block"
import { PatientsPageShell } from "../components/patients-page-shell"
import { RegisterPatients } from "./register-patients/register-patients"
import { GenerateInviteModal } from "./components/generate-Invite-modal"
import { cn } from "@/lib/utils"

// ── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
    icon: React.ReactNode
    iconBg: string
    value: number | string
    label: string
    sub?: string
    subTrend?: "up" | "neutral"
    isLoading?: boolean
}

function MetricCard({ icon, iconBg, value, label, sub, subTrend, isLoading }: MetricCardProps) {
    return (
        <div className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm">
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", iconBg)}>
                {icon}
            </div>
            <div className="flex flex-col gap-0.5">
                {isLoading ? (
                    <div className="h-7 w-12 animate-pulse rounded bg-muted" />
                ) : (
                    <span className="text-2xl font-bold tabular-nums leading-none">{value}</span>
                )}
                <span className="text-xs text-muted-foreground font-medium">{label}</span>
                {sub && (
                    <span className={cn(
                        "text-[11px] font-medium flex items-center gap-1",
                        subTrend === "up" ? "text-emerald-600" : "text-muted-foreground"
                    )}>
                        {subTrend === "up" && <TrendingUp className="h-3 w-3" />}
                        {sub}
                    </span>
                )}
            </div>
        </div>
    )
}
// ─────────────────────────────────────────────────────────────────────────────

export function PatientsList() {
    const { setTitle } = useHeaderStore()
    const { filters, setPage, setOrder, clearFilters } = usePatientFilters()
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [isInviteOpen,   setIsInviteOpen]   = useState(false)

    useEffect(() => { setTitle("Pacientes") }, [setTitle])

    // Main query
    const { data: result, isLoading, isFetching } = useQuery({
        queryKey: ["patients", filters.pageIndex, filters.filter, filters.status, filters.order],
        queryFn: () => getPatients({
            pageIndex: filters.pageIndex,
            perPage:   filters.perPage,
            filter:    filters.filter,
            status:    filters.status,
            order:     filters.order,
        }),
        staleTime: 30_000,
        gcTime: 300_000,
        refetchOnWindowFocus: true,
        placeholderData: (prev) => prev,
    })

    // Lightweight count queries for metric cards
    const { data: totalData, isLoading: loadingTotal } = useQuery({
        queryKey: ["patients-count", "all"],
        queryFn: () => getPatients({ pageIndex: 0, perPage: 1 }),
        staleTime: 60_000,
        gcTime: 300_000,
    })
    const { data: activeData } = useQuery({
        queryKey: ["patients-count", "active"],
        queryFn: () => getPatients({ pageIndex: 0, perPage: 1, status: "active" }),
        staleTime: 60_000,
        gcTime: 300_000,
    })
    const { data: inactiveData } = useQuery({
        queryKey: ["patients-count", "inactive"],
        queryFn: () => getPatients({ pageIndex: 0, perPage: 1, status: "inactive" }),
        staleTime: 60_000,
        gcTime: 300_000,
    })

    const patients = useMemo(() => result?.patients ?? [], [result])
    const meta = useMemo(() => result?.meta ?? {
        pageIndex: filters.pageIndex,
        perPage: filters.perPage,
        totalCount: 0,
    }, [result, filters])

    const totalCount    = totalData?.meta.totalCount    ?? 0
    const activeCount   = activeData?.meta.totalCount   ?? 0
    const inactiveCount = inactiveData?.meta.totalCount ?? 0

    const hasActiveFilters = !!filters.filter || filters.status !== "all"

    function handleSortByName() {
        setOrder(filters.order === "asc" ? "desc" : "asc")
    }

    const headerRight = (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className={cn(
                    "flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4",
                    "border border-border bg-background text-[13px] font-medium",
                    "shadow-sm transition-all hover:bg-muted hover:-translate-y-px active:scale-[0.98]",
                )}
            >
                <QrCode className="h-4 w-4" />
                Link de auto-cadastro
            </button>
            <button
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className={cn(
                    "flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4",
                    "bg-blue-600 text-[13px] font-medium text-white",
                    "shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all",
                    "hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98]",
                )}
            >
                <UserRoundPlus className="h-4 w-4" />
                Cadastrar paciente
            </button>
        </div>
    )

    return (
        <>
            <Helmet title="Pacientes" />

            <PatientsPageShell
                title="Pacientes"
                description="Gerencie sua base de pacientes — busque, filtre, abra prontuários e mantenha tudo atualizado."
                icon={<UsersRound className="size-6 text-blue-600" />}
                headerRight={headerRight}
                contentClassName="p-0"
            >
                {/* Metric cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-6 pt-2 pb-0">
                    <MetricCard
                        icon={<UsersRound className="h-5 w-5 text-blue-600" />}
                        iconBg="bg-blue-500/10"
                        value={totalCount}
                        label="Total de pacientes"
                        isLoading={loadingTotal}
                    />
                    <MetricCard
                        icon={<Activity className="h-5 w-5 text-emerald-600" />}
                        iconBg="bg-emerald-500/10"
                        value={activeCount}
                        label="Ativos"
                    />
                    <MetricCard
                        icon={<UserRoundPlus className="h-5 w-5 text-amber-600" />}
                        iconBg="bg-amber-500/10"
                        value="—"
                        label="Novos (30 dias)"
                        sub="em breve"
                    />
                    <MetricCard
                        icon={<Clock className="h-5 w-5 text-zinc-500" />}
                        iconBg="bg-zinc-500/10"
                        value={inactiveCount}
                        label="Inativos"
                    />
                </div>

                {/* Table section */}
                <div className="px-6 py-4">
                    <PatientsDataBlock
                        title="Lista de pacientes"
                        description={`Mostrando ${meta.totalCount > 0 ? Math.min(filters.perPage, meta.totalCount) : 0} de ${meta.totalCount} pacientes`}
                        toolbar={
                            <PatientsTableFilters
                                totalCount={totalCount}
                                activeCount={activeCount}
                                inactiveCount={inactiveCount}
                                isFetching={isFetching}
                            />
                        }
                        footer={
                            meta.totalCount > 0 ? (
                                <Pagination
                                    pageIndex={meta.pageIndex}
                                    totalCount={meta.totalCount}
                                    perPage={meta.perPage}
                                    onPageChange={setPage}
                                />
                            ) : null
                        }
                    >
                        <PatientsTable
                            patients={patients}
                            isLoading={isLoading}
                            perPage={filters.perPage}
                            hasActiveFilters={hasActiveFilters}
                            sortOrder={filters.order}
                            onSortByName={handleSortByName}
                            onClearFilters={clearFilters}
                            onRegister={() => setIsRegisterOpen(true)}
                        />
                    </PatientsDataBlock>
                </div>
            </PatientsPageShell>

            {/* Dialogs fora do shell */}
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                {isRegisterOpen && (
                    <RegisterPatients onSuccess={() => setIsRegisterOpen(false)} />
                )}
            </Dialog>

            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <GenerateInviteModal />
            </Dialog>
        </>
    )
}
