import { useSearchParams } from "react-router-dom"
import { z } from "zod"

export type PatientSortOrder = "asc" | "desc"

export function usePatientFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get("page") ?? "1"
  const pageIndex = z.coerce
    .number()
    .transform((val) => val - 1)
    .catch(0)
    .parse(page)

  const filter = searchParams.get("filter") ?? ""
  const status = searchParams.get("status") ?? "all"
  const order  = (searchParams.get("order") ?? "asc") as PatientSortOrder

  const filters = {
    pageIndex: Math.max(0, pageIndex),
    perPage: 10,
    filter,
    status,
    order,
  }

  function setPage(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString())
      return state
    })
  }

  function setFilters({ filter, status }: { filter?: string; status?: string }) {
    setSearchParams((state) => {
      if (filter !== undefined) {
        if (filter.trim()) {
          state.set("filter", filter.trim())
        } else {
          state.delete("filter")
        }
      }

      if (status !== undefined) {
        if (status !== "all") {
          state.set("status", status)
        } else {
          state.delete("status")
        }
      }

      state.set("page", "1")
      return state
    })
  }

  function setOrder(next: PatientSortOrder) {
    setSearchParams((state) => {
      state.set("order", next)
      state.set("page", "1")
      return state
    })
  }

  function clearFilters() {
    setSearchParams((state) => {
      state.delete("filter")
      state.delete("status")
      state.set("page", "1")
      return state
    })
  }

  return { filters, setPage, setFilters, setOrder, clearFilters }
}
