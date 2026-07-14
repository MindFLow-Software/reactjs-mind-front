import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import type { IPatient } from '@/types/patient/patient'
import { Normalizer } from '@/utils/normalizer'
import type { IpatientsQueryParams } from './hooks/use-patients-query-params'
import type { PatientSortBy } from '@/hooks/use-patient-filters'

type PatientStatus = 'ACTIVE' | 'REJECTED' | 'PENDING' | 'BLOCKED'

export function formatPatientsShowing(showing: number, total: number): string {
  return `Mostrando ${showing} de ${total} pacientes`
}

export function calcTotalPatients(perPage: number, total: number): number {
  return total > 0 ? Math.min(perPage, total) : 0
}

export function hasActiveFilters(
  filter: string,
  status: PatientStatus | null,
): boolean {
  return filter.length > 0 || status !== null
}

function matchesSearch(patient: IPatient, term: string): boolean {
  const normalizedTerm = term.trim().toLowerCase()
  if (!normalizedTerm) return true

  const digitsTerm = Normalizer.digits(term)
  const fullName = patient.name.toLowerCase()
  const email = patient.email?.toLowerCase() ?? ''
  const cpfDigits = Normalizer.digits(patient.cpf)
  const phoneDigits = Normalizer.digits(patient.phoneNumber)

  return (
    fullName.includes(normalizedTerm) ||
    email.includes(normalizedTerm) ||
    (digitsTerm.length > 0 && cpfDigits.includes(digitsTerm)) ||
    (digitsTerm.length > 0 && phoneDigits.includes(digitsTerm))
  )
}

function matchesStatus(patient: IPatient, isActive?: boolean): boolean {
  if (isActive === undefined) return true
  return (patient.status === PatientProfileStatus.ACTIVE) === isActive
}

function matchesGender(
  patient: IPatient,
  gender?: IpatientsQueryParams['gender'],
): boolean {
  if (!gender) return true
  return patient.gender === gender
}

function compareByColumn(
  a: IPatient,
  b: IPatient,
  column: PatientSortBy,
): number {
  switch (column) {
    case 'name':
      return a.name.localeCompare(b.name)
    case 'age':
      return (
        (a.dateOfBirth ? new Date(a.dateOfBirth).getTime() : 0) -
        (b.dateOfBirth ? new Date(b.dateOfBirth).getTime() : 0)
      )
    case 'gender':
      return a.gender.localeCompare(b.gender)
    case 'status':
      return a.status.localeCompare(b.status)
    case 'lastSession':
      return (
        (a.lastSessionAt ? new Date(a.lastSessionAt).getTime() : 0) -
        (b.lastSessionAt ? new Date(b.lastSessionAt).getTime() : 0)
      )
    default:
      return 0
  }
}

export function filterAndSortPatients(
  patients: IPatient[],
  params: IpatientsQueryParams,
): IPatient[] {
  const filtered = patients.filter(
    (patient) =>
      matchesSearch(patient, params.filter ?? '') &&
      matchesStatus(patient, params.isActive) &&
      matchesGender(patient, params.gender),
  )

  if (!params.orderBy) return filtered

  const orderBy = params.orderBy
  const sorted = [...filtered].sort((a, b) => compareByColumn(a, b, orderBy))
  return params.order === 'desc' ? sorted.reverse() : sorted
}
