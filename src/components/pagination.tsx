import { memo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from './ui/button'
import './pagination.css'

export interface IPaginationState {
  pageIndex: number
  perPage: number
  totalCount: number
  onPageChange: (pageIndex: number) => void
}

interface IPagination {
  pagination: IPaginationState
  totalLabel?: string
}

export const Pagination = memo(function Pagination({
  pagination: { pageIndex, perPage, totalCount, onPageChange },
  totalLabel = 'registros',
}: IPagination) {
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
            size="icon"
            variant="outline"
            className="pgn-btn"
            disabled={isFirstPage}
            onClick={() => onPageChange(0)}
          >
            <ChevronsLeft className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="pgn-btn"
            disabled={isFirstPage}
            onClick={() => onPageChange(pageIndex - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="pgn-btn"
            disabled={isLastPage}
            onClick={() => onPageChange(pageIndex + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="pgn-btn"
            disabled={isLastPage}
            onClick={() => onPageChange(pages - 1)}
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
})
