import { memo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from './ui/button'
import './pagination.css'

export interface PaginationState {
  pageIndex: number
  perPage: number
  totalCount: number
  onPageChange: (pageIndex: number) => void
}

interface PaginationProps {
  pagination: PaginationState
  totalLabel?: string
}

export const Pagination = memo(function Pagination({
  pagination: { pageIndex, perPage, totalCount, onPageChange },
  totalLabel = 'registros',
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1
  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex === pages - 1

  return (
    <div className="pgn-root">
      <span className="pgn-total">
        Total de {totalCount} {totalLabel}
      </span>

      <div className="pgn-pages">
        <div className="pgn-indicator">
          Página {pageIndex + 1} de {pages}
        </div>
        <div className="pgn-controls">
          <Button
            onClick={() => onPageChange(0)}
            variant="outline"
            className="pgn-btn"
            disabled={isFirstPage}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Primeira página</span>
          </Button>

          <Button
            onClick={() => onPageChange(pageIndex - 1)}
            variant="outline"
            className="pgn-btn"
            disabled={isFirstPage}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <Button
            onClick={() => onPageChange(pageIndex + 1)}
            variant="outline"
            className="pgn-btn"
            disabled={isLastPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>

          <Button
            onClick={() => onPageChange(pages - 1)}
            variant="outline"
            className="pgn-btn"
            disabled={isLastPage}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
})
