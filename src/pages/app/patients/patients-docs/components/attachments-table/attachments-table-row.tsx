'use client'

import { Trash2, Download, Eye, MoreHorizontal } from 'lucide-react'

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
import { Files } from '@/utils/files'
import { Time } from '@/utils/time'
import type { IAttachmentListItem as Attachment } from '@/types/attachment/attachment-list-item'
import './attachments-table-row.css'

type AttachmentsTableRowSelection = {
  isSelected: boolean
  isActivePreview: boolean
  onSelectChange: (checked: boolean) => void
}

type AttachmentsTableRowActions = {
  onDelete: (id: string) => void
  onPreview: (doc: Attachment) => void
}

type AttachmentsTableRowProps = {
  attachment: Attachment
  selection: AttachmentsTableRowSelection
  actions: AttachmentsTableRowActions
}

function getRowStateClassName(isActivePreview: boolean, isSelected: boolean) {
  if (isActivePreview) return 'pd-row-active'
  if (isSelected) return 'pd-row-selected'
  return 'pd-row-idle'
}

function DocThumb({
  contentType,
  filename,
}: {
  contentType: string
  filename: string
}) {
  const kind = Files.kind(contentType)
  const style = Files.KIND_STYLES[kind]
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
  selection,
  actions,
}: AttachmentsTableRowProps) {
  const { isSelected, isActivePreview, onSelectChange } = selection
  const { onDelete, onPreview } = actions
  const { id, filename, contentType, sizeInBytes, uploadedAt, patient } =
    attachment
  const kind = Files.kind(contentType)
  const badge = Files.TYPE_BADGE[kind]

  return (
    <TooltipProvider delayDuration={200}>
      <TableRow
        onClick={() => onPreview(attachment)}
        className={cn(
          'group pd-row',
          getRowStateClassName(isActivePreview, isSelected),
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
              <p className="pd-row-name-size">
                {Files.formatSize(sizeInBytes)}
              </p>
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
          <span className="pd-row-size">{Files.formatSize(sizeInBytes)}</span>
        </TableCell>

        {/* Date */}
        <TableCell>
          <div className="flex flex-col">
            <span className="pd-row-date">
              {uploadedAt ? Time.toBrazilianFormat(uploadedAt) : '—'}
            </span>
            {uploadedAt && (
              <span className="pd-row-time">
                {Time.toHourMinute(uploadedAt)}
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
                  onClick={() => Files.download(id, filename)}
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
                  onClick={() => Files.download(id, filename)}
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
