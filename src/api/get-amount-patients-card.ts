import { api } from "@/lib/axios"

export interface GetAmountPatientsCardResponse {
    total: number
}

export async function getAmountPatientsCard(): Promise<GetAmountPatientsCardResponse> {
    const { data } = await api.get<GetAmountPatientsCardResponse>("/patients/stats/card")
    return data
}
