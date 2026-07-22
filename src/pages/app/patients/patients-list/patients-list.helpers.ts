// import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
// import type { IPatient } from '@/types/patient/patient'
// import { Normalizer } from '@/utils/normalizer'
// import { Time } from '@/utils/time'
import type { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
// import {
//   PatientSortBy,
//   PatientSortOrder,
//   type IPatientsQueryParams,
// } from './patients-list.types'

// type IPatientComparator = (a: IPatient, b: IPatient) => number

// const COMPARATORS: Record<PatientSortBy, IPatientComparator> = {
//   [PatientSortBy.NAME]: (a, b) => a.name.localeCompare(b.name),
//   [PatientSortBy.AGE]: (a, b) =>
//     Time.timestamp(a.dateOfBirth) - Time.timestamp(b.dateOfBirth),
//   [PatientSortBy.GENDER]: (a, b) => a.gender.localeCompare(b.gender),
//   [PatientSortBy.STATUS]: (a, b) => a.status.localeCompare(b.status),
//   [PatientSortBy.LAST_SESSION]: (a, b) =>
//     Time.timestamp(a.lastSessionAt) - Time.timestamp(b.lastSessionAt),
// }

export function formatPatientsShowing(showing: number, total: number): string {
  return `Mostrando ${showing} de ${total} pacientes`
}

export function calcTotalPatients(perPage: number, total: number): number {
  return total > 0 ? Math.min(perPage, total) : 0
}

export function hasActiveFilters(
  filter: string,
  status: PatientProfileStatus | null,
): boolean {
  return filter.length > 0 || status !== null
}

// function matchesSearch(patient: IPatient, term: string): boolean {
//   const normalizedTerm = term.trim().toLowerCase()
//   if (!normalizedTerm) return true

//   const digitsTerm = Normalizer.digits(term)
//   const fullName = patient.name.toLowerCase()
//   const email = patient.email?.toLowerCase() ?? ''
//   const cpfDigits = Normalizer.digits(patient.cpf)
//   const phoneDigits = Normalizer.digits(patient.phoneNumber)

//   return (
//     fullName.includes(normalizedTerm) ||
//     email.includes(normalizedTerm) ||
//     (digitsTerm.length > 0 && cpfDigits.includes(digitsTerm)) ||
//     (digitsTerm.length > 0 && phoneDigits.includes(digitsTerm))
//   )
// }

// function matchesStatus(patient: IPatient, isActive?: boolean): boolean {
//   if (isActive === undefined) return true
//   return (patient.status === PatientProfileStatus.ACTIVE) === isActive
// }

// function matchesGender(
//   patient: IPatient,
//   gender?: IPatientsQueryParams['gender'],
// ): boolean {
//   if (!gender) return true
//   return patient.gender === gender
// }

// export function filterAndSortPatients(
//   patients: IPatient[],
//   params: IPatientsQueryParams,
// ): IPatient[] {
//   const filtered = patients.filter(
//     (patient) =>
//       matchesSearch(patient, params.filter ?? '') &&
//       matchesStatus(patient, params.isActive) &&
//       matchesGender(patient, params.gender),
//   )

//   const compare = params.orderBy ? COMPARATORS[params.orderBy] : null
//   if (!compare) return filtered

//   const sorted = [...filtered].sort(compare)
//   return params.order === PatientSortOrder.DESC ? sorted.reverse() : sorted
// }
