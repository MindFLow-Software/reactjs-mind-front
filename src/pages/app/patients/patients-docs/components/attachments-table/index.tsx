'use client'

import { useState, useCallback } from 'react'
import { Paperclip } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { AttachmentsTableRow } from './attachments-table-row'
import { BulkDeleteAction } from '../bulk-delete-action'
import type { IAttachmentListItem as Attachment } from '@/types/attachment/attachment-list-item'
import './attachments-table.css'

interface AttachmentsTableData {
  attachments: Attachment[]
  isLoading: boolean
  perPage?: number
}

interface AttachmentsTableSelection {
  previewDocId?: string
  onPreview: (doc: Attachment) => void
  onDelete: (id: string) => void
}

interface AttachmentsTableProps {
  data: AttachmentsTableData
  selection: AttachmentsTableSelection
}

function AttachmentsTableSkeletonRow({ index }: { index: number }) {
  return (
    <TableRow key={`sk-${index}`}>
      <TableCell className="px-4">
        <Skeleton className="h-4 w-4 rounded" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-9 rounded-md" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-[140px]" />
            <Skeleton className="h-2.5 w-[60px]" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-[60px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[60px] rounded-full" />
      </TableCell>
      <TableCell className="text-right pr-4">
        <div className="flex justify-end gap-1.5">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
      </TableCell>
    </TableRow>
  )
}

function AttachmentsTableEmptyRow({ columnCount }: { columnCount: number }) {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className="pd-tbl-empty-cell">
        <div className="pd-tbl-empty">
          <div className="pd-tbl-empty-icon">
            <Paperclip className="size-9 text-muted-foreground/30" />
          </div>
          <p className="pd-tbl-empty-title">Nenhum documento encontrado.</p>
          <p className="pd-tbl-empty-sub">
            Ajuste os filtros ou envie um novo arquivo.
          </p>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function AttachmentsTable({ data, selection }: AttachmentsTableProps) {
  const { attachments, isLoading, perPage = 10 } = data
  const { previewDocId, onPreview, onDelete } = selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const columnCount = 7

  const isAllSelected =
    attachments.length > 0 && selectedIds.length === attachments.length
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < attachments.length

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedIds(checked ? attachments.map((d) => d.id) : [])
    },
    [attachments],
  )

  const handleToggleSelect = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    )
  }, [])

  const handleBulkDelete = useCallback(() => {
    selectedIds.forEach((id) => onDelete(id))
    setSelectedIds([])
  }, [selectedIds, onDelete])

  function renderBody() {
    if (isLoading) {
      return Array.from({ length: perPage }).map((_, i) => (
        <AttachmentsTableSkeletonRow key={`sk-${i}`} index={i} />
      ))
    }

    if (attachments.length === 0) {
      return <AttachmentsTableEmptyRow columnCount={columnCount} />
    }

    return attachments.map((doc) => (
      <AttachmentsTableRow
        key={doc.id}
        attachment={doc}
        selection={{
          isSelected: selectedIds.includes(doc.id),
          isActivePreview: previewDocId === doc.id,
          onSelectChange: (checked) => handleToggleSelect(doc.id, checked),
        }}
        actions={{ onDelete, onPreview }}
      />
    ))
  }

  return (
    <div className="pd-tbl-root">
      {selectedIds.length > 0 && (
        <BulkDeleteAction
          selection={{ count: selectedIds.length, isDeleting: false }}
          onConfirm={handleBulkDelete}
          onClear={() => setSelectedIds([])}
        />
      )}

      <div className="pd-tbl-wrap">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="pd-tbl-head-row">
              <TableHead className="pd-tbl-head-checkbox">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el)
                      (
                        el as HTMLButtonElement & { indeterminate?: boolean }
                      ).indeterminate = isIndeterminate
                  }}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  aria-label="Selecionar todos"
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="pd-tbl-th">Nome</TableHead>
              <TableHead className="pd-tbl-th min-w-[180px]">
                Paciente
              </TableHead>
              <TableHead className="pd-tbl-th w-[100px]">Tamanho</TableHead>
              <TableHead className="pd-tbl-th w-[130px]">Enviado em</TableHead>
              <TableHead className="pd-tbl-th w-[90px]">Tipo</TableHead>
              <TableHead className="pd-tbl-th w-[110px] pr-4 text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>{renderBody()}</TableBody>
        </Table>
      </div>
    </div>
  )
}
