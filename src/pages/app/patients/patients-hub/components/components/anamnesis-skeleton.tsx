import { Skeleton } from "@/components/ui/skeleton"

export function AnamnesisSkeleton() {
    return (
        <div className="w-full space-y-4 py-2">
            {/* Simulação do Header */}
            <div className="flex items-center justify-between px-2">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-36" />
                </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 space-y-6">
                {/* Simulação da Toolbar */}
                <div className="flex gap-2 rounded-xl bg-muted/40 p-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-8 w-20" />
                    ))}
                </div>

                {/* Simulação do Bloco de Editor */}
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-8 w-24" />
                    </div>

                    <div className="rounded-xl border p-4 space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}