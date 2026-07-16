import { api } from '@/lib/axios'

export type RankingItem = {
  position: string
  userId: string
  name: string
  points: number
  approvedIdeas: number
  highlight: string
}

export type GetRankingResponse = {
  ranking: RankingItem[]
}

export async function getRanking() {
  const response = await api.get<GetRankingResponse>('/suggestions/ranking')

  return response.data.ranking
}
