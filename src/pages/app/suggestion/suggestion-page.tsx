"use client"

import { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import {
    LayoutGrid,
    Rocket,
    Microscope,
    Search,
    XCircle,
    Plus,
    Lightbulb,
    SquarePen,
    ChevronsUp,
    Zap,
    Check,
    ListFilter,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { useHeaderStore } from "@/hooks/use-header-store"
import { useDebounce } from "@/hooks/use-debounce"
import { getSuggestions } from "@/api/suggestions/get-suggestions"
import { SuggestionColumn } from "./components/board/suggestion-column"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { CreateSuggestion } from "./components/create/create-suggestion"
import { SuggestionHelpButton } from "./components/help/suggestion-help-button"

type CategoryFilter = "UI_UX" | "SCHEDULING" | "REPORTS" | "PRIVACY_LGPD" | "INTEGRATIONS" | "OTHERS"

const FILTER_CATEGORIES: { value: CategoryFilter; label: string; dot: string }[] = [
    { value: "UI_UX", label: "Fluxo", dot: "bg-violet-500" },
    { value: "REPORTS", label: "Relatórios", dot: "bg-amber-500" },
    { value: "INTEGRATIONS", label: "Integrações", dot: "bg-blue-500" },
    { value: "SCHEDULING", label: "Paciente", dot: "bg-pink-500" },
    { value: "PRIVACY_LGPD", label: "Financeiro", dot: "bg-emerald-500" },
    { value: "OTHERS", label: "Outros", dot: "bg-slate-400" },
]

const BRAND_COLOR = "#2563eb"

const COLUMN_CONFIG = [
    {
        title: "Votação",
        icon: Lightbulb,
        status: "OPEN",
        iconColor: "text-blue-500",
        badgeClass: "bg-blue-100 text-blue-700",
    },
    {
        title: "Em Estudo",
        icon: Microscope,
        status: "UNDER_REVIEW",
        iconColor: "text-purple-500",
        badgeClass: "bg-purple-100 text-purple-700",
    },
    {
        title: "Implementando",
        icon: Rocket,
        status: "PLANNED",
        iconColor: "text-amber-500",
        badgeClass: "bg-amber-100 text-amber-700",
    },
    {
        title: "Concluído",
        icon: Check,
        status: "IMPLEMENTED",
        iconColor: "text-emerald-500",
        badgeClass: "bg-emerald-100 text-emerald-700",
    },
] as const

export function SuggestionPage() {
    const { setTitle } = useHeaderStore()
    const [search, setSearch] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter | null>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const debouncedSearch = useDebounce(search, 400)

    useEffect(() => {
        setTitle("Envios da Comunidade")
    }, [setTitle])

    const { data: suggestions, isLoading } = useQuery({
        queryKey: ["suggestions", debouncedSearch],
        queryFn: () => getSuggestions({
            search: debouncedSearch,
            sortBy: 'most_voted'
        }),
    })

    const totalCount = suggestions?.length ?? 0

    const filterByStatus = (status: string) => {
        let filtered = suggestions?.filter((s) => s.status === status) ?? []
        if (selectedCategory) filtered = filtered.filter((s) => s.category === selectedCategory)
        return filtered
    }

    const categoryCount = (cat: CategoryFilter) =>
        suggestions?.filter((s) => s.category === cat).length ?? 0

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            const tag = (e.target as HTMLElement).tagName
            if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
                e.preventDefault()
                searchInputRef.current?.focus()
            }
        }
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [])

    return (
        <>
            <Helmet title="Envios da Comunidade" />

            <div className="flex flex-col gap-6 mt-4 h-[calc(100vh-160px)] overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 pl-5 py-2" style={{ borderLeftColor: BRAND_COLOR }}>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                            <LayoutGrid className="size-6" style={{ color: BRAND_COLOR }} />
                            <span>Sugestões da Comunidade</span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Compartilhe ideias para melhorar o Mind. Vote nas sugestões que mais
                        </p>
                        <p className="text-sm text-muted-foreground">
                            importam - As mais votadas viram prioridade no desenvolvimento.
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="cursor-pointer gap-2 w-full lg:w-auto shrink-0 bg-blue-700 hover:bg-blue-800 shadow-sm transition-all">
                                <Plus className="h-4 w-4" />
                                Nova sugestão
                            </Button>
                        </DialogTrigger>
                        <CreateSuggestion onSuccess={() => setIsCreateOpen(false)} />
                    </Dialog>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
                    <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
                        <div className="size-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <SquarePen className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-none">128</p>
                            <p className="text-xs text-muted-foreground mt-1.5">Sugestões totais</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
                        <div className="size-11 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                            <ChevronsUp className="size-5 text-violet-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-none">2.341</p>
                            <p className="text-xs text-muted-foreground mt-1.5">Votos da comunidade</p>
                            <p className="text-[11px] font-semibold text-emerald-600 mt-1">+84 esta semana</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
                        <div className="size-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <Zap className="size-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-none">9</p>
                            <p className="text-xs text-muted-foreground mt-1.5">Em produção agora</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4">
                        <div className="size-11 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            <Check className="size-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold leading-none">42</p>
                            <p className="text-xs text-muted-foreground mt-1.5">Já implementadas</p>
                            <p className="text-[11px] font-semibold text-emerald-600 mt-1">+6 nos últimos 30d</p>
                        </div>
                    </div>
                </div>

                <div className="border border-border rounded-xl p-3 bg-card shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative flex-1 min-w-[160px]">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                ref={searchInputRef}
                                placeholder="Buscar sugestões"
                                className="h-8 w-full pl-8 text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <XCircle className="size-3.5" />
                                </button>
                            )}
                        </div>

                        <button className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium border border-border text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer shrink-0">
                            <ListFilter className="size-3.5" />
                            Mais votadas
                        </button>

                        <div className="h-4 w-px bg-border shrink-0" />

                        <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border",
                                    selectedCategory === null
                                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                                        : "border-border text-muted-foreground hover:bg-muted/50"
                                )}
                            >
                                Todas
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                                    selectedCategory === null
                                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                                        : "bg-muted text-muted-foreground"
                                )}>
                                    {totalCount}
                                </span>
                            </button>

                            {FILTER_CATEGORIES.map((cat) => {
                                const isSelected = selectedCategory === cat.value
                                return (
                                    <button
                                        key={cat.value}
                                        onClick={() => setSelectedCategory(isSelected ? null : cat.value)}
                                        className={cn(
                                            "inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border",
                                            isSelected
                                                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                                                : "border-border text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        <span className={cn("size-2 rounded-full shrink-0", cat.dot)} />
                                        {cat.label}
                                        <span className={cn(
                                            "text-[10px] px-1.5 py-0.5 rounded-full font-semibold",
                                            isSelected
                                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
                                                : "bg-muted text-muted-foreground"
                                        )}>
                                            {categoryCount(cat.value)}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-4 h-full min-h-0 auto-cols-fr"
                    role="region"
                >
                    {COLUMN_CONFIG.map((column) => {
                        const Icon = column.icon
                        return (
                            <SuggestionColumn
                                key={column.status}
                                title={column.title}
                                icon={<Icon className={`size-4 ${column.iconColor}`} />}
                                badgeClass={column.badgeClass}
                                suggestions={filterByStatus(column.status)}
                                isLoading={isLoading}
                            />
                        )
                    })}
                </div>
            </div>

            <SuggestionHelpButton />
        </>
    )
}