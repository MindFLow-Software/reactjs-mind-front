import { useSearchParams } from "react-router-dom"
import { z } from "zod"
import { useCallback, useMemo } from "react"

export function usePatientFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageIndex = z.coerce
    .number()
    .int()
    .min(1)
    .catch(1)
    .transform((page) => page - 1)
    .parse(searchParams.get("pageIndex") ?? "1")

  const perPage = 12

  const name = searchParams.get("name") || undefined
  const cpf = searchParams.get("cpf") || undefined
  const status = searchParams.get("status") || undefined

  // Memoiza os filtros para evitar loops de re-render no React Query
  const filters = useMemo(() => ({
    pageIndex,
    perPage,
    name,
    cpf,
    status
  }), [pageIndex, perPage, name, cpf, status])

  // Função helper para mudar de página
  const setPage = useCallback((newPageIndex: number) => {
    setSearchParams((state) => {
      // Converte índice 0 (API) para página 1 (URL)
      state.set("pageIndex", String(newPageIndex + 1))
      return state
    })
  }, [setSearchParams])

  return { filters, setPage }
}