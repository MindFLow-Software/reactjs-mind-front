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
        return <span className="text-xs font-bold text-slate-400 ml-1.5">{pos}</span>
    }

    const top5Ranking = ranking?.slice(0, 5)

    return (
        <Card className="border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#27187E]/10 rounded-xl">
                            <Star className="size-6 text-[#27187E] fill-[#27187E]/20" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-800">Top 5 Colaboradores</CardTitle>
                            <CardDescription className="text-xs font-medium">Líderes em sugestões implementadas</CardDescription>
                        </div>
                    </div>

                    <TooltipProvider>
                        <Tooltip delayDuration={300}>
                            <TooltipTrigger asChild>
                                <div className="cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <Info className="size-4 text-slate-400" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent
                                side="left"
                                sideOffset={10}
                                className="max-w-[250px] p-3 text-xs leading-relaxed bg-white border-slate-200 shadow-lg text-slate-600"
                            >
                                <p className="font-bold mb-1 text-slate-800">Como pontuar?</p>
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
                        <Loader2 className="size-8 animate-spin text-[#27187E]/30" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="w-[80px] font-black text-[10px] uppercase text-slate-400 text-center">Posição</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-slate-400">Usuário</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-slate-400 text-center">Pontos</TableHead>
                                <TableHead className="font-black text-[10px] uppercase text-slate-400 text-center">Entregas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {top5Ranking?.map((item) => (
                                <TableRow
                                    key={item.userId}
                                    className={cn(
                                        "group border-slate-50 transition-colors",
                                        item.position === "1º" && "bg-amber-50/30 hover:bg-amber-50/50",
                                        item.position === "2º" && "bg-slate-50/30 hover:bg-slate-50/50",
                                        item.position === "3º" && "bg-orange-50/20 hover:bg-orange-50/40"
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
                                                item.position === "1º" ? "bg-amber-100 border-amber-200 text-amber-700" : "bg-slate-100 border-slate-200 text-slate-600"
                                            )}>
                                                {item.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-slate-700 text-sm">
                                                {item.name}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-black text-[#27187E] text-sm tabular-nums">
                                            {Number(item.points).toFixed(1)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="font-bold text-slate-600 text-xs">{item.approvedIdeas}</span>
                                            <span className="text-[9px] text-slate-400 uppercase font-medium">Concluídas</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {!isLoading && top5Ranking?.length === 0 && (
                    <div className="p-20 text-center">
                        <p className="text-sm text-slate-400 italic">O Top 5 será formado conforme ideias forem implementadas.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}