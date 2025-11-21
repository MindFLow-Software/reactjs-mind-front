import { api } from "@/lib/axios"
import { formatCPF } from "@/utils/formatCPF"
import { formatPhone } from "@/utils/formatPhone"

export interface Patient {
    id: string
    firstName: string
    lastName: string
    email?: string
    cpf: string
    phoneNumber: string
    profileImageUrl?: string
    dateOfBirth: string
    gender: "MASCULINE" | "FEMININE" | "OTHER"
    status?: string
}

export interface GetPatientsQuery { 
    pageIndex?: number
    perPage?: number
    name?: string | null
    cpf?: string | null 
    status?: string | null
}

export interface GetPatientsResponse {
    patients: Patient[]
    meta: {
        pageIndex: number
        perPage: number
        totalCount: number
    }
}

export async function getPatients(query: GetPatientsQuery): Promise<GetPatientsResponse> {
    const { pageIndex, perPage, name, cpf, status } = query 
    
    const response = await api.get<GetPatientsResponse>('/patients', {
        params: {
            pageIndex: pageIndex ?? 0,
            perPage: perPage ?? 10,
            name, 
            cpf,
            status: status === "all" ? null : status,
        },
    })

    const rawData = response.data

    const formattedPatients = rawData.patients.map(patient => ({
        ...patient,
        cpf: formatCPF(patient.cpf),
        phoneNumber: formatPhone(patient.phoneNumber), 
    }))

    return {
        ...rawData,
        patients: formattedPatients,
    }
}