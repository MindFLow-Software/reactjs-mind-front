import { createContext, useContext } from 'react'
import type { IPatientsSort } from '../../../patients-list.types'

export const PatientsSortContext = createContext<IPatientsSort | undefined>(
  undefined,
)

export function usePatientsSort() {
  return useContext(PatientsSortContext)
}
