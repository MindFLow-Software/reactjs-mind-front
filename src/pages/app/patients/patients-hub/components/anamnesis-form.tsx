"use client"

import { useEffect, useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getAnamnesis, saveAnamnesis } from "@/api/anamnesis"
import type { AnamnesisData } from "@/api/anamnesis" // 🟢 Correção: import type
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export function AnamnesisTab({ patientId }: { patientId: string }) {
    const [formData, setFormData] = useState<AnamnesisData | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: ["anamnesis", patientId],
        queryFn: () => getAnamnesis(patientId),
    })

    // 🟢 Sincroniza o estado local quando os dados chegam (Substitui o onSuccess)
    useEffect(() => {
        if (data) {
            setFormData(data)
        }
    }, [data])

    const { mutate } = useMutation({
        mutationFn: (newData: AnamnesisData) => saveAnamnesis(patientId, newData),
        onError: () => toast.error("Falha ao salvar anamnese automaticamente."),
    })

    useEffect(() => {
        if (!formData || formData === data) return

        const timer = setTimeout(() => {
            mutate(formData)
        }, 2000)

        return () => clearTimeout(timer)
    }, [formData, mutate, data])

    if (isLoading || !formData) return <AnamnesisSkeleton />

    const handleUpdate = (field: keyof AnamnesisData, value: string) => {
        setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Anamnese</h2>
                    <p className="text-muted-foreground text-sm">
                        As alterações são salvas automaticamente.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase text-blue-500 tracking-tighter">
                        1. Queixa Principal
                    </Label>
                    <Textarea
                        value={formData.chiefComplaint}
                        onChange={(e) => handleUpdate("chiefComplaint", e.target.value)}
                        placeholder="Relato do paciente sobre o motivo da consulta..."
                        className="min-h-[150px] leading-relaxed resize-none"
                    />
                </div>

                <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase text-blue-500 tracking-tighter">
                        2. Histórico Familiar
                    </Label>
                    <Textarea
                        value={formData.familyHistory}
                        onChange={(e) => handleUpdate("familyHistory", e.target.value)}
                        placeholder="Dinâmica familiar, antecedentes, relações..."
                        className="min-h-[150px] leading-relaxed resize-none"
                    />
                </div>

                <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase text-blue-500 tracking-tighter">
                        3. Histórico Pessoal
                    </Label>
                    <Textarea
                        value={formData.personalHistory}
                        onChange={(e) => handleUpdate("personalHistory", e.target.value)}
                        placeholder="Desenvolvimento, marcos importantes, vida social..."
                        className="min-h-[150px] leading-relaxed resize-none"
                    />
                </div>
            </div>
        </div>
    )
}

function AnamnesisSkeleton() {
    return (
        <div className="space-y-8 py-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-[150px] w-full" />
                </div>
            ))}
        </div>
    )
}