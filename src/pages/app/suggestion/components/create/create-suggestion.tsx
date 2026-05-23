"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Send, Loader2, Lightbulb, FileText, Paperclip,
    Activity, BarChart2, Zap, Heart, Shield, HelpCircle
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"

import { createSuggestion } from "@/api/suggestions/create-suggestion"
import { SuggestionAttachments } from "./suggestion-attachments"
import { SuggestionSuccess } from "./suggestion-success-dialog"
import { cn } from "@/lib/utils"
import { createSuggestionSchema, type CreateSuggestionSchema } from "@/validators/suggestions"

type CategoryValue = CreateSuggestionSchema["category"]

interface CategoryConfig {
    value: CategoryValue
    label: string
    description: string
    icon: LucideIcon
    iconColor: string
    iconBg: string
}

const CATEGORIES: CategoryConfig[] = [
    { value: "UI_UX",        label: "Interface e Visual",   description: "UI/UX, design, usabilidade",    icon: Activity,    iconColor: "text-violet-600",  iconBg: "bg-violet-100"  },
    { value: "SCHEDULING",   label: "Agenda e Consultas",   description: "Horários, sessões, calendário", icon: Heart,       iconColor: "text-blue-600",    iconBg: "bg-blue-100"    },
    { value: "REPORTS",      label: "Relatórios",           description: "Financeiro, gráficos, exports", icon: BarChart2,   iconColor: "text-amber-600",   iconBg: "bg-amber-100"   },
    { value: "PRIVACY_LGPD", label: "Segurança e LGPD",    description: "Privacidade, dados, proteção",  icon: Shield,      iconColor: "text-emerald-600", iconBg: "bg-emerald-100" },
    { value: "INTEGRATIONS", label: "Integrações Externas", description: "WhatsApp, Google, APIs",        icon: Zap,         iconColor: "text-indigo-600",  iconBg: "bg-indigo-100"  },
    { value: "OTHERS",       label: "Outros Assuntos",      description: "Qualquer outra sugestão",       icon: HelpCircle,  iconColor: "text-slate-400",   iconBg: "bg-slate-100"   },
]

interface CreateSuggestionProps {
    onSuccess: () => void
}

export function CreateSuggestion({ onSuccess }: CreateSuggestionProps) {
    const [files, setFiles] = useState<File[]>([])
    const [isSubmitted, setIsSubmitted] = useState(false)
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<CreateSuggestionSchema>({
        resolver: zodResolver(createSuggestionSchema),
        defaultValues: { description: "" },
    })

    const descriptionValue = watch("description") || ""
    const selectedCategory = watch("category")

    async function onSubmit(data: CreateSuggestionSchema) {
        try {
            await createSuggestion({ ...data, files })
            await queryClient.invalidateQueries({ queryKey: ["suggestions"] })
            setIsSubmitted(true)
        } catch {
            toast.error("Erro ao enviar sugestão. Tente novamente.")
        }
    }

    if (isSubmitted) {
        return <SuggestionSuccess onClose={() => {
            setIsSubmitted(false)
            setFiles([])
            reset()
            onSuccess()
        }} />
    }

    return (
        <DialogContent className="max-w-2xl p-0 gap-0 flex flex-col max-h-[90vh] sm:rounded-2xl overflow-hidden">
            <DialogHeader className="px-6 pt-5 pb-4 border-b shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 shrink-0">
                        <Lightbulb className="size-5 text-blue-600" />
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-bold text-left">Nova sugestão</DialogTitle>
                        <DialogDescription className="text-sm text-left">
                            Descreva sua ideia em detalhes — quanto mais clara, mais rápido a comunidade entende e vota.
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 min-h-0">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <div className="size-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-blue-600 text-[10px] font-extrabold">i</span>
                    </div>
                    <div className="space-y-2 min-w-0">
                        <p className="text-sm font-semibold text-blue-900">Antes de enviar, dê uma olhada no board</p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Sua ideia pode já existir. Se encontrar algo parecido, prefira{" "}
                            <strong>dar um voto</strong> na sugestão existente — assim ela ganha mais força.
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-white/70 border border-blue-200 rounded-full px-3 py-1">
                            <span className="text-blue-500 font-bold">✓</span>
                            Mínimo de 200 caracteres no detalhamento
                        </div>
                    </div>
                </div>

                <form id="create-suggestion-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="size-3.5 text-muted-foreground" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Classificação</span>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="title" className={cn("text-sm font-medium", errors.title && "text-red-500")}>
                                Título <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                {...register("title")}
                                placeholder="Resuma sua ideia em uma frase curta"
                                maxLength={80}
                                className={cn(errors.title && "border-red-500 focus-visible:ring-red-500")}
                            />
                            {errors.title && (
                                <p className="text-[11px] text-red-500 font-medium">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className={cn("text-sm font-medium", errors.category && "text-red-500")}>
                                Categoria <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {CATEGORIES.map((cat) => {
                                    const Icon = cat.icon
                                    const isSelected = selectedCategory === cat.value
                                    return (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setValue("category", cat.value, { shouldValidate: true })}
                                            className={cn(
                                                "flex flex-col gap-2.5 p-3 rounded-xl border-2 text-left transition-all cursor-pointer",
                                                isSelected
                                                    ? "border-blue-500 bg-blue-50/60 shadow-sm"
                                                    : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/20"
                                            )}
                                        >
                                            <div className={cn("size-9 rounded-lg flex items-center justify-center shrink-0", cat.iconBg)}>
                                                <Icon className={cn("size-4", cat.iconColor)} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className={cn(
                                                    "text-xs font-semibold leading-tight",
                                                    isSelected ? "text-blue-700" : "text-foreground"
                                                )}>
                                                    {cat.label}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                                    {cat.description}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                            {errors.category && (
                                <p className="text-[11px] text-red-500 font-medium">{errors.category.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="size-3.5 text-muted-foreground" />
                                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Detalhamento</span>
                            </div>
                            <span className={cn(
                                "text-[11px] font-bold px-2.5 py-0.5 rounded-full",
                                descriptionValue.length < 200
                                    ? "bg-red-50 text-red-600"
                                    : "bg-emerald-50 text-emerald-600"
                            )}>
                                {descriptionValue.length} / 200
                            </span>
                        </div>
                        <Textarea
                            {...register("description")}
                            className={cn(
                                "min-h-[120px] resize-none",
                                errors.description && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="Descreva detalhadamente o que você imaginou..."
                        />
                        {errors.description && (
                            <p className="text-[11px] text-red-500 font-medium">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Paperclip className="size-3.5 text-muted-foreground" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Anexos</span>
                        </div>
                        <SuggestionAttachments files={files} onFileChange={setFiles} />
                    </div>
                </form>
            </div>

            <div className="shrink-0 px-6 py-4 border-t bg-background flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-xs text-muted-foreground truncate">
                        Será analisada pela moderação antes de ir à votação
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onSuccess}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="create-suggestion-form"
                        disabled={isSubmitting}
                        size="sm"
                        className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold min-w-[160px]"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Send className="h-4 w-4" />
                                Enviar sugestão
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </DialogContent>
    )
}
