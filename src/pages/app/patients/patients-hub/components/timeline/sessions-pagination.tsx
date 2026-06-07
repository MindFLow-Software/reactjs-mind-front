'use client'

import { memo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import './sessions-pagination.css'

interface PaginationProps {
  pageIndex: number
  totalCount: number
  perPage: number
  onPageChange: (pageIndex: number) => void
}

export const Pagination = memo(function Pagination({
  pageIndex,
  totalCount,
  perPage,
  onPageChange,
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1

  const isFirstPage = pageIndex === 0
  const isLastPage = pageIndex === pages - 1

  return (
    <div className="sp-root">
      <span className="sp-total">Total de {totalCount} Sessões</span>

      <div className="sp-right">
        <span className="sp-page-label">
          Página {pageIndex + 1} de {pages}
        </span>

        <div className="sp-buttons">
          <Button
            variant="outline"
            className="sp-btn"
            onClick={() => onPageChange(0)}
            disabled={isFirstPage}
          >
            <ChevronsLeft className="sp-btn-icon" />
            <span className="sr-only">Primeira página</span>
          </Button>

          <Button
            variant="outline"
            className="sp-btn"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={isFirstPage}
          >
            <ChevronLeft className="sp-btn-icon" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <Button
            variant="outline"
            className="sp-btn"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={isLastPage}
          >
            <ChevronRight className="sp-btn-icon" />
            <span className="sr-only">Próxima página</span>
          </Button>

          <Button
            variant="outline"
            className="sp-btn"
            onClick={() => onPageChange(pages - 1)}
            disabled={isLastPage}
          >
            <ChevronsRight className="sp-btn-icon" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
})
