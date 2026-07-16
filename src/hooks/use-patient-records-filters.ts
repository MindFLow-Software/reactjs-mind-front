import type { ISessionVolume } from '@/types/patient/session-volume'
import { useState, useEffect } from 'react'

export type PatientRecordsFilters = {
  search: string
  debouncedSearch: string
  gender: string
  sessionOrder: ISessionVolume
  setSearch: (value: string) => void
  setGender: (value: string) => void
  setSessionOrder: (value: ISessionVolume) => void
  clearFilters: () => void
}

export function usePatientRecordsFilters(): PatientRecordsFilters {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [gender, setGender] = useState('all')
  const [sessionOrder, setSessionOrder] = useState<ISessionVolume>('all')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  function clearFilters() {
    setSearch('')
    setGender('all')
    setSessionOrder('all')
  }

  return {
    search,
    debouncedSearch,
    gender,
    sessionOrder,
    setSearch,
    setGender,
    setSessionOrder,
    clearFilters,
  }
}
