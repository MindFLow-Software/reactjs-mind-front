import { useEffect, useState } from 'react'
import type { DateRange } from 'react-day-picker'

import { useDebounce } from '@/hooks/use-debounce'

export type IUseAttachmentsFiltersReturn = {
  pageIndex: number
  setPageIndex: (val: number) => void
  search: string
  setSearch: (val: string) => void
  debouncedSearch: string
  patientId: string
  setPatientId: (val: string) => void
  date: DateRange | undefined
  setDate: (val: DateRange | undefined) => void
  contentType: string | undefined
  setContentType: (val: string | undefined) => void
  clearFilters: () => void
  hasActiveFilters: boolean
}

export function useAttachmentsFilters(): IUseAttachmentsFiltersReturn {
  const [pageIndex, setPageIndexState] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [patientId, setPatientIdState] = useState('all')
  const [date, setDateState] = useState<DateRange | undefined>()
  const [contentType, setContentTypeState] = useState<string | undefined>()
  const { debounce } = useDebounce()

  useEffect(() => {
    debounce(() => {
      setDebouncedSearch(search)
      setPageIndexState(0)
    }, 220)
  }, [search, debounce])

  const setPageIndex = (val: number) => setPageIndexState(val)

  const setPatientId = (val: string) => {
    setPatientIdState(val)
    setPageIndexState(0)
  }

  const setDate = (val: DateRange | undefined) => {
    setDateState(val)
    setPageIndexState(0)
  }

  const setContentType = (val: string | undefined) => {
    setContentTypeState(val)
    setPageIndexState(0)
  }

  const clearFilters = () => {
    setSearch('')
    setPatientIdState('all')
    setDateState(undefined)
    setContentTypeState(undefined)
    setPageIndexState(0)
  }

  const hasActiveFilters = Boolean(
    search || patientId !== 'all' || date?.from || contentType,
  )

  return {
    pageIndex,
    setPageIndex,
    search,
    setSearch,
    debouncedSearch,
    patientId,
    setPatientId,
    date,
    setDate,
    contentType,
    setContentType,
    clearFilters,
    hasActiveFilters,
  }
}
