import { api } from "@/lib/axios"
import { format } from "date-fns"
import type { Gender } from "@/types/enum-gender"

export interface UpdatePatientData {
    id: string
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    profileImageUrl?: string
    dateOfBirth?: Date | string | null
    cpf?: string
    gender?: Gender
    attachmentIds?: string[]
}

export async function updatePatients({ id, ...data }: UpdatePatientData) {
    const formattedData = {
        ...data,
        dateOfBirth:
            data.dateOfBirth instanceof Date
                ? format(data.dateOfBirth, "yyyy-MM-dd")
                : data.dateOfBirth || undefined,
        cpf: data.cpf || undefined,
        phoneNumber: data.phoneNumber || undefined,
    }

    const payload = Object.fromEntries(
        Object.entries(formattedData).filter(
            ([_, value]) => value !== undefined && value !== null
        )
    )

    const response = await api.put(`/patients/${id}`, payload)
    return response.data
}