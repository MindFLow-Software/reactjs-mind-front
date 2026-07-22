import type { IPaginationMeta } from '@/types/shared/pagination-meta'
import type { IPatient } from '@/types/patient/patient'
import type { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import type { Gender } from '@/types/shared/enums'

export enum PatientSortBy {
  NAME = 'name',
  AGE = 'age',
  GENDER = 'gender',
  STATUS = 'status',
  LAST_SESSION = 'lastSession',
}

export enum PatientSortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type IStatusPillOption = {
  value: PatientProfileStatus | null
  label: string
  dot: string | null
  activeCls: string
}

export type IPatientsFilters = {
  pageIndex: number
  perPage: number
  filter: string
  status: PatientProfileStatus | null
  gender: Gender | null
  sortBy?: PatientSortBy
  order: PatientSortOrder
}

export type IPatientsFiltersInput = {
  filter?: string
  status?: PatientProfileStatus | null
  gender?: Gender | null
}

export type IUsePatientFilters = {
  filters: IPatientsFilters
  setPage: (pageIndex: number) => void
  setFilters: (input: IPatientsFiltersInput) => void
  setSort: (column: PatientSortBy) => void
  setOrder: (next: PatientSortOrder) => void
  clearFilters: () => void
}

export type IPatientsQueryParams = {
  pageIndex: number
  perPage: number
  filter?: string
  status?: PatientProfileStatus | null
  gender?: Gender | null
  orderBy?: PatientSortBy
  order: PatientSortOrder
}

export type IPatientsSort = {
  by: PatientSortBy
  order: PatientSortOrder
  onSort: (column: PatientSortBy) => void
}

/** Values match the `describe()` group each field carries in the patient form schemas. */
export enum RegisterPatientTab {
  BASIC_DATA = 'basicData',
  CONTACT = 'contact',
  DOCUMENTS = 'documents',
}

export type IRegisterStep = {
  id: number
  label: string
  required: boolean
  key: RegisterPatientTab
}

export type IPatientFormSteps = {
  current: number
  isFirstStep: boolean
  isLastStep: boolean
  handleNext: () => void
  handleBack: () => void
  goToStep: (id: number) => void
}

export type IPatientRegistrationData = {
  fullName?: string | null
  cpf?: string | null
  email?: string | null
  phoneNumber?: string | null
}

export type IEvolutionRecord = {
  patientName: string
  content: string
  date: Date | string | null
  diagnosis?: string
}

export type IPatientsMetrics = {
  activeCount: number
  archivedCount: number
  newPatientsCount: number
  isLoading: boolean
}

export type IPatientsMetricCounts = {
  totalCount: number
  activeCount: number
  archivedCount: number
  newPatientsCount: number
}

export type IPatientsListQueryResult = {
  patients: IPatient[]
  meta: IPaginationMeta
  isLoading: boolean
  isFetching: boolean
}

export type IUsePatientStatusGuard = {
  isToggleDisabled: boolean
  disabledReason: string
}
