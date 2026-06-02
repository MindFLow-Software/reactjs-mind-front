import { useEffect, useMemo, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "@tanstack/react-query"
import { UsersRound, UserRoundPlus, QrCode, Clock, Activity, ArrowUp, Upload, Download, Columns3 } from "lucide-react"
import { Dialog } from "@/components/ui/dialog"

import { Pagination } from "@/components/pagination"
import { PatientsTableFilters } from "./components/table/patients-table-filters"
import { PatientsTable } from "./components/table/patients-table"

import { useHeaderStore } from "@/hooks/use-header-store"
import { usePatientFilters } from "@/hooks/use-patient-filters"
import { getPatients } from "@/api/patients/get-patients"
import { PatientsDataBlock } from "../components/patients-data-block"
import { PatientsPageShell } from "../components/patients-page-shell"
import { RegisterPatients } from "./register-patients/register-patients"
import { useCreatePatientDraft } from "./register-patients/hooks/use-create-patient-draft"
import { GenerateInviteModal } from "./components/dialogs/generate-invite-modal"
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
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", iconBg)}>
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
                        subTrend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                    )}>
                        {subTrend === "up" && <ArrowUp className="h-3 w-3" />}
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
    const { filters, setPage, setSort, clearFilters } = usePatientFilters()
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const [isInviteOpen,   setIsInviteOpen]   = useState(false)
    const registerDraft = useCreatePatientDraft()

    useEffect(() => { setTitle("Pacientes") }, [setTitle])

    // Main query
    // ToDo: fix status filter
    const { data: result, isLoading, isFetching } = useQuery({
        queryKey: ["patients", filters.pageIndex, filters.filter, filters.status],
        queryFn: () => getPatients({
            pageIndex: filters.pageIndex,
            perPage:   filters.perPage,
            filter:    filters.filter,
            // status:    filters.status,
        }),
        staleTime: 30_000,
        gcTime: 300_000,
        refetchOnWindowFocus: true,
        placeholderData: (prev) => prev,
    })

    const patients = useMemo(() => result?.patients ?? [], [result])
    const meta = useMemo(() => result?.meta ?? {
        pageIndex: filters.pageIndex,
        perPage: filters.perPage,
        totalCount: 0,
    }, [result, filters])

    const totalCount = meta.totalCount
    const loadingTotal = isLoading

    const { data: statusCounts, isLoading: loadingCounts } = useQuery({
        queryKey: ["patients-count"],
        queryFn: async () => {
            const [active, inactive] = await Promise.all([
                getPatients({ pageIndex: 0, perPage: 1, /*status: "active"*/ }),
                getPatients({ pageIndex: 0, perPage: 1, /*status: "inactive"*/ }),
            ])
            return {
                active:   active.meta.totalCount,
                inactive: inactive.meta.totalCount,
            }
        },
        staleTime: 60_000,
        gcTime:    300_000,
        refetchOnWindowFocus: false,
        placeholderData: (prev) => prev,
    })

    const activeCount   = statusCounts?.active   ?? 0
    const inactiveCount = statusCounts?.inactive ?? 0

    const hasActiveFilters = !!filters.filter

    const btnSecondary = cn(
        "flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4",
        "border border-border bg-background text-[13px] font-medium",
        "shadow-sm transition-all hover:bg-muted hover:-translate-y-px active:scale-[0.98]",
    )

    const headerRight = (
        <div className="flex items-center gap-2">
            <button type="button" className={btnSecondary}>
                <Upload className="h-4 w-4" />
                Importar
            </button>
            <button
                type="button"
                onClick={() => setIsInviteOpen(true)}
                className={btnSecondary}
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
                    "hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98] cursor-pointer",
                )}
            >
                <UserRoundPlus className="h-4 w-4" />
                Cadastrar paciente
            </button>
        </div>
    )

    const tableActions = (
        <>
            <button type="button" className={cn(btnSecondary, "h-8 px-3 text-xs rounded-lg")}>
                <Download className="h-3.5 w-3.5" />
                Exportar
            </button>
            <button type="button" className={cn(btnSecondary, "h-8 px-3 text-xs rounded-lg")}>
                <Columns3 className="h-3.5 w-3.5" />
                Colunas
            </button>
        </>
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
                        sub="8 este mês"
                        subTrend="up"
                        isLoading={loadingCounts}
                    />
                    <MetricCard
                        icon={<UserRoundPlus className="h-5 w-5 text-amber-600" />}
                        iconBg="bg-amber-500/10"
                        value="—"
                        label="Novos (30 dias)"
                        sub="24%"
                        subTrend="up"
                    />
                    <MetricCard
                        icon={<Clock className="h-5 w-5 text-red-500" />}
                        iconBg="bg-red-500/10"
                        value={inactiveCount}
                        label="Arquivados"
                        sub="sem sessão há 60 dias"
                        subTrend="neutral"
                        isLoading={loadingCounts}
                    />
                </div>

                {/* Table section */}
                <div className="px-6 py-4">
                    <PatientsDataBlock
                        title="Lista de pacientes"
                        description={`Mostrando ${meta.totalCount > 0 ? Math.min(filters.perPage, meta.totalCount) : 0} de ${meta.totalCount} pacientes`}
                        headerActions={tableActions}
                        toolbar={
                            <PatientsTableFilters
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
                            sortBy={filters.sortBy}
                            sortOrder={filters.order}
                            onSort={setSort}
                            onClearFilters={clearFilters}
                            onRegister={() => setIsRegisterOpen(true)}
                        />
                    </PatientsDataBlock>
                </div>
            </PatientsPageShell>

            {/* Dialogs fora do shell */}
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                {isRegisterOpen && (
                    <RegisterPatients
                        draft={registerDraft}
                        onSuccess={() => setIsRegisterOpen(false)}
                    />
                )}
            </Dialog>

            <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <GenerateInviteModal />
            </Dialog>
        </>
    )
}
