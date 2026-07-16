import { z } from 'zod'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Gender } from '@/types/shared/enums'
import {
  PatientSortBy,
  PatientSortOrder,
  PatientStatusFilter,
  type IPatientsFilters,
  type IPatientsFiltersInput,
  type IUsePatientFilters,
} from '../patients-list.types'

const PER_PAGE = 10

const VALID_STATUSES: readonly string[] = Object.values(PatientStatusFilter)
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

function parseStatus(raw: string): PatientStatusFilter | null {
  return VALID_STATUSES.includes(raw) ? (raw as PatientStatusFilter) : null
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

export function usePatientFilters(): IUsePatientFilters {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters: IPatientsFilters = {
    pageIndex: parsePageIndex(searchParams.get('page') ?? '1'),
    perPage: PER_PAGE,
    filter: searchParams.get('filter') ?? '',
    status: parseStatus(searchParams.get('status') ?? ''),
    gender: parseGender(searchParams.get('gender') ?? ''),
    sortBy: parseSortBy(searchParams.get('sortBy')),
    order: parseOrder(searchParams.get('order')),
  }

  const setPage = useCallback(
    (pageIndex: number) => {
      setSearchParams((state) => {
        state.set('page', (pageIndex + 1).toString())
        return state
      })
    },
    [setSearchParams],
  )

  const setFilters = useCallback(
    ({ filter, status, gender, sessionVolume }: IPatientsFiltersInput) => {
      setSearchParams((state) => {
        filter ? state.set('filter', filter.trim()) : state.delete('filter')
        status ? state.set('status', status) : state.delete('status')
        gender ? state.set('gender', gender) : state.delete('gender')
        sessionVolume
          ? state.set('sessionVolume', sessionVolume)
          : state.delete('sessionVolume')

        state.set('page', '1')
        return state
      })
    },
    [setSearchParams],
  )

  const setSort = useCallback(
    (column: PatientSortBy) => {
      setSearchParams((state) => {
        const currentColumn =
          parseSortBy(state.get('sortBy')) ?? PatientSortBy.NAME
        const currentOrder = parseOrder(state.get('order'))

        if (column === currentColumn) {
          state.set(
            'order',
            currentOrder === PatientSortOrder.ASC
              ? PatientSortOrder.DESC
              : PatientSortOrder.ASC,
          )
        } else {
          state.set('sortBy', column)
          state.set('order', PatientSortOrder.ASC)
        }

        state.set('page', '1')
        return state
      })
    },
    [setSearchParams],
  )

  const setOrder = useCallback(
    (next: PatientSortOrder) => {
      setSearchParams((state) => {
        state.set('order', next)
        state.set('page', '1')
        return state
      })
    },
    [setSearchParams],
  )

  const clearFilters = useCallback(() => {
    setSearchParams((state) => {
      state.delete('filter')
      state.delete('status')
      state.delete('gender')
      state.delete('sessionVolume')
      state.set('page', '1')
      return state
    })
  }, [setSearchParams])

  return { filters, setPage, setFilters, setSort, setOrder, clearFilters }
}
