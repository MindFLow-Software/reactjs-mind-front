import { z } from 'zod'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Gender } from '@/types/patient'

type PatientStatus = 'ACTIVE' | 'REJECTED' | 'PENDING' | 'BLOCKED'

const VALID_STATUSES = ['ACTIVE', 'REJECTED', 'PENDING', 'BLOCKED'] as const
const VALID_GENDERS = Object.values(Gender)

export type PatientSortOrder = 'asc' | 'desc'
export type PatientSortBy =
  | 'name'
  | 'age'
  | 'gender'
  | 'status'
  | 'lastSession'

export function usePatientFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const PER_PAGE = 10
  const page = searchParams.get('page') ?? '1'
  const pageIndex = z.coerce
    .number()
    .transform((val) => val - 1)
    .catch(0)
    .parse(page)

  const filter = searchParams.get('filter') ?? ''

  const rawStatus = searchParams.get('status') ?? ''
  const status = (VALID_STATUSES as readonly string[]).includes(rawStatus)
    ? (rawStatus as PatientStatus)
    : null

  const rawGender = searchParams.get('gender') ?? ''
  const gender = (VALID_GENDERS as readonly string[]).includes(rawGender)
    ? (rawGender as Gender)
    : null

  const sortBy = (searchParams.get('sortBy') ?? undefined) as
    | PatientSortBy
    | undefined
  const order = (searchParams.get('order') ?? 'asc') as PatientSortOrder

  const filters = {
    pageIndex: Math.max(0, pageIndex),
    perPage: PER_PAGE,
    filter,
    status,
    gender,
    sortBy,
    order,
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
    ({
      filter,
      status,
      gender,
      sessionVolume,
    }: {
      filter?: string
      status?: PatientStatus | null
      gender?: Gender | null
      sessionVolume?: string | null
    }) => {
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
        const currentColumn = (state.get('sortBy') ?? 'name') as PatientSortBy
        const currentOrder = (state.get('order') ?? 'asc') as PatientSortOrder

        if (column === currentColumn) {
          state.set('order', currentOrder === 'asc' ? 'desc' : 'asc')
        } else {
          state.set('sortBy', column)
          state.set('order', 'asc')
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
