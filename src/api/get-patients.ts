import { api } from "@/lib/axios"

export interface GetPatientsFilters {
  pageIndex: number
  perPage: number
  filter?: string | null | undefined
  status?: string | null | undefined
  gender?: string | null | undefined
  order?: string | null | undefined
}

export interface Patient {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  cpf: string
  phoneNumber: string 
  gender: 'MASCULINE' | 'FEMININE' | 'OTHER'
  status: 'Ativo' | 'Inativo'
  isActive: boolean
  createdAt: string
  dateOfBirth: string 
  profileImageUrl: string | null
  lastSessionAt: string | null
}

export interface GetPatientsResponse {
  patients: Patient[]
  meta: {
    pageIndex: number
    perPage: number
    totalCount: number
  }
}

export async function getPatients({
  pageIndex,
  perPage,
  filter,
  status,
  gender,
  order,
}: GetPatientsFilters): Promise<GetPatientsResponse> {
  
  const response = await api.get("/patients", { 
    params: {
      pageIndex,
      perPage,
      filter: filter || undefined,
      status: status === 'all' ? null : status,
      gender: gender === 'all' ? null : gender,
      order: order === 'all' ? null : order,
    },
  })

  const normalizedPatients: Patient[] = response.data.patients.map((p: any) => {
    const raw = p.props || p 
    const checkIsActive = raw.isActive === true || raw.status === 'active'

    return {
      id: raw.id || p.id,
      firstName: raw.firstName || "",
      lastName: raw.lastName || "",
      name: raw.name || `${raw.firstName} ${raw.lastName}`.trim() || "Paciente sem nome",
      cpf: raw.cpf || "",
      email: raw.email || "",
      phoneNumber: raw.phoneNumber || "",
      gender: raw.gender || 'OTHER',
      isActive: checkIsActive,
      status: checkIsActive ? 'Ativo' : 'Inativo',
      createdAt: raw.createdAt,
      dateOfBirth: raw.dateOfBirth,
      profileImageUrl: raw.profileImageUrl || raw.profile_image_url || null,
      lastSessionAt: raw.lastSessionAt || null
    }
  })

  return {
    patients: normalizedPatients,
    meta: response.data.meta
  }
}