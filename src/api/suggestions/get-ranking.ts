import { api } from "@/lib/axios"

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