'use client'

import { Trash2, Download, Eye, MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { handleFileDownload } from '@/utils/handle-file-download'
import { formatFileSize } from '@/utils/format-file-size'
import type { IAttachmentListItem as Attachment } from '@/types/attachment/attachment-list-item'
import { getFileKind, FILE_KIND_STYLES, TYPE_BADGE } from '@/utils/file-helpers'
import './attachments-table-row.css'

interface AttachmentsTableRowProps {
  attachment: Attachment
  isSelected: boolean
  isActivePreview: boolean
  onSelectChange: (checked: boolean) => void
  onDelete: (id: string) => void
  onPreview: (doc: Attachment) => void
}

function DocThumb({
  contentType,
  filename,
}: {
  contentType: string
  filename: string
}) {
  const kind = getFileKind(contentType)
  const style = FILE_KIND_STYLES[kind]
  const ext =
    filename.split('.').pop()?.toUpperCase().slice(0, 4) ?? style.label

  return (
    <div className={cn('pd-row-thumb', style.gradient)}>
      <div className="pd-row-thumb-corner" />
      <span className={cn('pd-row-thumb-ext', style.labelColor)}>{ext}</span>
    </div>
  )
}

function PatientAvatar({
  firstName,
  lastName,
}: {
  firstName: string
  lastName: string
}) {
  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
  return <div className="pd-row-avatar">{initials}</div>
}

export function AttachmentsTableRow({
  attachment,
  isSelected,
  isActivePreview,
  onSelectChange,
  onDelete,
  onPreview,
}: AttachmentsTableRowProps) {
  const { id, filename, contentType, sizeInBytes, uploadedAt, patient } =
    attachment
  const kind = getFileKind(contentType)
  const badge = TYPE_BADGE[kind]

  return (
    <TooltipProvider delayDuration={200}>
      <TableRow
        onClick={() => onPreview(attachment)}
        className={cn(
          'group pd-row',
          isActivePreview
            ? 'pd-row-active'
            : isSelected
              ? 'pd-row-selected'
              : 'pd-row-idle',
        )}
      >
        <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={(c) => onSelectChange(!!c)}
            aria-label={`Selecionar ${filename}`}
            className="cursor-pointer"
          />
        </TableCell>

        {/* Name */}
        <TableCell>
          <div className="pd-row-name">
            <DocThumb contentType={contentType} filename={filename} />
            <div className="min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="pd-row-name-text">{filename}</p>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {filename}
                </TooltipContent>
              </Tooltip>
              <p className="pd-row-name-size">{formatFileSize(sizeInBytes)}</p>
            </div>
          </div>
        </TableCell>

        {/* Patient */}
        <TableCell>
          {patient ? (
            <div className="pd-row-patient">
              <PatientAvatar
                firstName={patient.firstName}
                lastName={patient.lastName}
              />
              <div className="min-w-0">
                <p className="pd-row-patient-name">
                  {patient.firstName} {patient.lastName}
                </p>
              </div>
            </div>
          ) : (
            <span className="pd-row-nolink">Sem vínculo</span>
          )}
        </TableCell>

        {/* Size */}
        <TableCell>
          <span className="pd-row-size">{formatFileSize(sizeInBytes)}</span>
        </TableCell>

        {/* Date */}
        <TableCell>
          <div className="flex flex-col">
            <span className="pd-row-date">
              {uploadedAt
                ? format(new Date(uploadedAt), 'dd/MM/yyyy', { locale: ptBR })
                : '—'}
            </span>
            {uploadedAt && (
              <span className="pd-row-time">
                {format(new Date(uploadedAt), 'HH:mm')}
              </span>
            )}
          </div>
        </TableCell>

        {/* Type badge */}
        <TableCell>
          <span className={cn('pd-row-badge', badge.bg, badge.text)}>
            {badge.label}
          </span>
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
          <div className="pd-row-actions">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="pd-row-action pd-row-action-view"
                  onClick={() => onPreview(attachment)}
                >
                  <Eye className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Visualizar
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="pd-row-action pd-row-action-download"
                  onClick={() => handleFileDownload(id, filename)}
                >
                  <Download className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Baixar
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="pd-row-action pd-row-action-more"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Mais ações
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  className="pd-row-menu-item"
                  onClick={() => onPreview(attachment)}
                >
                  <Eye className="size-3.5" />
                  Visualizar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="pd-row-menu-item"
                  onClick={() => handleFileDownload(id, filename)}
                >
                  <Download className="size-3.5" />
                  Baixar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="pd-row-menu-item-danger"
                  onClick={() => onDelete(id)}
                >
                  <Trash2 className="size-3.5" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
    </TooltipProvider>
  )
}
