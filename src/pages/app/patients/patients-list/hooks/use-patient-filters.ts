import { z } from 'zod'
import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { PatientProfileStatus } from '@/types/patient-profile/patient-profile-status'
import { Gender } from '@/types/shared/enums'
import {
  PatientSortBy,
  PatientSortOrder,
  type IPatientsFilters,
  type IPatientsFiltersInput,
  type IUsePatientFilters,
} from '../patients-list.types'

const PER_PAGE = 10
const FIRST_PAGE = '1'

const VALID_STATUSES: readonly string[] = Object.values(PatientProfileStatus)
const VALID_GENDERS: readonly string[] = Object.values(Gender)
const VALID_SORT_COLUMNS: readonly string[] = Object.values(PatientSortBy)

function parsePageIndex(page: string): number {
  const pageIndex = z.coerce
    .number()
    .transform((value) => value - 1)
    .catch(0)
    .parse(page)

  return Math.max(0, pageIndex)
}

function parseStatus(raw: string): PatientProfileStatus | null {
  return VALID_STATUSES.includes(raw) ? (raw as PatientProfileStatus) : null
}

function parseGender(raw: string): Gender | null {
  return VALID_GENDERS.includes(raw) ? (raw as Gender) : null
}

function parseSortBy(raw: string | null): PatientSortBy | undefined {
  if (!raw || !VALID_SORT_COLUMNS.includes(raw)) return undefined
  return raw as PatientSortBy
}

function parseOrder(raw: string | null): PatientSortOrder {
  return raw === PatientSortOrder.DESC
    ? PatientSortOrder.DESC
    : PatientSortOrder.ASC
}

/** Only `undefined` leaves the param untouched — `null` and `''` clear it. */
function applyParam(
  state: URLSearchParams,
  key: string,
  value: string | null | undefined,
): void {
  if (value === undefined) return

  if (!value) {
    state.delete(key)
    return
  }

  state.set(key, value)
}

export function usePatientFilters(): IUsePatientFilters {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<IPatientsFilters>(
    () => ({
      pageIndex: parsePageIndex(searchParams.get('page') ?? FIRST_PAGE),
      perPage: PER_PAGE,
      filter: searchParams.get('filter') ?? '',
      status: parseStatus(searchParams.get('status') ?? ''),
      gender: parseGender(searchParams.get('gender') ?? ''),
      sortBy: parseSortBy(searchParams.get('sortBy')),
      order: parseOrder(searchParams.get('order')),
    }),
    [searchParams],
  )

  const setPage = useCallback(
    (pageIndex: number) => {
      setSearchParams((state) => {
        const next = new URLSearchParams(state)
        next.set('page', (pageIndex + 1).toString())
        return next
      })
    },
    [setSearchParams],
  )

  const setFilters = useCallback(
    ({ filter, status, gender }: IPatientsFiltersInput) => {
      setSearchParams((state) => {
        const next = new URLSearchParams(state)

        applyParam(next, 'filter', filter?.trim())
        applyParam(next, 'status', status)
        applyParam(next, 'gender', gender)
        next.set('page', FIRST_PAGE)

        return next
      })
    },
    [setSearchParams],
  )

  const setSort = useCallback(
    (column: PatientSortBy) => {
      setSearchParams((state) => {
        const next = new URLSearchParams(state)
        const currentColumn = parseSortBy(next.get('sortBy'))
        const currentOrder = parseOrder(next.get('order'))

        if (column === currentColumn) {
          next.set(
            'order',
            currentOrder === PatientSortOrder.ASC
              ? PatientSortOrder.DESC
              : PatientSortOrder.ASC,
          )
        } else {
          next.set('sortBy', column)
          next.set('order', PatientSortOrder.ASC)
        }

        next.set('page', FIRST_PAGE)
        return next
      })
    },
    [setSearchParams],
  )

  const setOrder = useCallback(
    (order: PatientSortOrder) => {
      setSearchParams((state) => {
        const next = new URLSearchParams(state)
        next.set('order', order)
        next.set('page', FIRST_PAGE)
        return next
      })
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams((state) => {
      const next = new URLSearchParams(state)

      next.delete('filter')
      next.delete('status')
      next.delete('gender')
      next.set('page', FIRST_PAGE)

      return next
    })
  }, [setSearchParams])

  return { filters, setPage, setFilters, setSort, setOrder, clearFilters }
}
