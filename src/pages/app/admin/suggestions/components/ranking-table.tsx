"use client"

import { useQuery } from "@tanstack/react-query"
import { Trophy, Medal, Star, Loader2, Info } from "lucide-react"
import { api } from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface RankingItem {
    position: string
    userId: string
    name: string
    points: number
    approvedIdeas: number
    highlight: string
}

export interface GetRankingResponse {
    ranking: RankingItem[]
}

export async function getRanking() {
    const response = await api.get<GetRankingResponse>("/suggestions/ranking")
    return response.data.ranking
}

export function SuggestionRanking() {
    const { data: ranking, isLoading } = useQuery<RankingItem[]>({
        queryKey: ["suggestions", "ranking", "top-5"],
        queryFn: getRanking,
        staleTime: 0,
        gcTime: 0,
    })

    const getRankIcon = (pos: string) => {
        if (pos === "1º") return <Trophy className="size-5 text-amber-500" />
        if (pos === "2º") return <Medal className="size-5 text-slate-400" />
        if (pos === "3º") return <Medal className="size-5 text-amber-700" />
        return <span className="text-xs font-bold text-muted-foreground ml-1.5">{pos}</span>
    }

    const top5Ranking = ranking?.slice(0, 5)

    return (
        <Card className="border-border shadow-xl rounded-2xl overflow-hidden bg-card transition-colors">
            <CardHeader className="bg-muted/30 border-b border-border p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl">
                            <Star className="size-6 text-primary fill-primary/20" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-foreground">Top 5 Colaboradores</CardTitle>
                            <CardDescription className="text-xs font-medium text-muted-foreground">Líderes em sugestões implementadas</CardDescription>
                        </div>
                    </div>

                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                <div className="cursor-pointer p-2 hover:bg-muted rounded-full transition-colors">
                                    <Info className="size-4 text-muted-foreground" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                side="left"
                                sideOffset={10}
                                className="max-w-[250px] p-3 text-xs leading-relaxed bg-popover border-border shadow-lg text-popover-foreground"
                            >
                                <p className="font-bold mb-1">Como pontuar?</p>
                                <ul className="space-y-1">
                                    <li>• 1.0 pt por ideia <strong>concluída</strong>.</li>
                                    <li>• 0.5 pts bônus a cada 10 votos em ideias concluídas.</li>
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex h-[350px] items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-primary/30" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="w-[80px] font-black text-[10px] uppercase text-muted-foreground text-center">Posição</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-muted-foreground">Usuário</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-muted-foreground text-center">Pontos</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-muted-foreground text-center">Entregas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {top5Ranking?.map((item) => (
                                <TableRow
                                    key={item.userId}
                                    className={cn(
                                        "group border-border transition-colors",
                                        item.position === "1º" && "bg-amber-500/5 hover:bg-amber-500/10",
                                        item.position === "2º" && "bg-slate-500/5 hover:bg-slate-500/10",
                                        item.position === "3º" && "bg-orange-500/5 hover:bg-orange-500/10"
                                    )}
                                >
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            {getRankIcon(item.position)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "size-8 rounded-full flex items-center justify-center text-[10px] font-bold border",
                                                item.position === "1º"
                                                    ? "bg-amber-500/20 border-amber-500/30 text-amber-500"
                                                    : "bg-muted border-border text-muted-foreground"
                                            )}>
                                                {item.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-foreground text-sm">
                                                {item.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-black text-primary text-sm tabular-nums">
                                            {Number(item.points).toFixed(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="font-bold text-foreground/80 text-xs">{item.approvedIdeas}</span>
                                            <span className="text-[9px] text-muted-foreground uppercase font-medium">Concluídas</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {!isLoading && top5Ranking?.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-sm text-muted-foreground italic">O Top 5 será formado conforme ideias forem implementadas.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}