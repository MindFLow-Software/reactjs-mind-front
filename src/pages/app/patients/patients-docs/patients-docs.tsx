'use client'

import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FolderOpen, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { PaginationDocsPatients } from '@/components/pagination-docs-patients'
import { useHeaderStore } from '@/hooks/use-header-store'
import {
  getAllAttachments,
  deleteAttachment,
} from '@/api/attachments/attachments'
import { PatientsDataBlock } from '../components/patients-data-block'
import { PatientsPageShell } from '../components/patients-page-shell'
import { cn } from '@/lib/utils'
import type { Attachment } from '@/api/attachments/attachments'

import { useAttachmentsFilters } from '@/hooks/use-attachments-filters'
import { MetricsCards } from './components/metrics-cards'
import { AttachmentsTableFilters } from './components/attachments-table/attachments-table-filters'
import { AttachmentsTable } from './components/attachments-table'
import { PreviewDrawer } from './components/preview-drawer'
import { UploadModal } from './components/upload-modal'

export function PatientDocuments() {
  const { setTitle } = useHeaderStore()
  const queryClient = useQueryClient()
  const filters = useAttachmentsFilters()

  const [previewDoc, setPreviewDoc] = useState<Attachment | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  useEffect(() => {
    setTitle('Gestão de Documentos')
  }, [setTitle])

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'all-attachments',
      filters.pageIndex,
      filters.debouncedSearch,
      filters.patientId,
      filters.date,
      filters.contentType,
    ],
    queryFn: () =>
      getAllAttachments({
        page: filters.pageIndex,
        filter: filters.debouncedSearch || undefined,
        patientId: filters.patientId === 'all' ? undefined : filters.patientId,
        from: filters.date?.from?.toISOString(),
        to: filters.date?.to?.toISOString(),
        contentType: filters.contentType || undefined,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  })

  const { mutateAsync: deleteFn } = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-attachments'] })
      queryClient.invalidateQueries({ queryKey: ['patients-with-attachments'] })
      toast.success('Documento removido.')
    },
  })

  const attachments = useMemo(() => result?.attachments ?? [], [result])
  const meta = useMemo(
    () =>
      result?.meta ?? {
        pageIndex: filters.pageIndex,
        perPage: 10,
        totalCount: 0,
        totalStorageSize: 0,
      },
    [result, filters.pageIndex],
  )

  const btnSecondary = cn(
    'flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4',
    'border border-border bg-background text-[13px] font-medium',
    'shadow-sm transition-all hover:bg-muted hover:-translate-y-px active:scale-[0.98]',
  )

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <p className="text-destructive font-medium">
          Erro ao carregar documentos.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm underline text-muted-foreground hover:text-foreground"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const headerRight = (
    <div className="flex items-center gap-2">
      <button type="button" className={btnSecondary}>
        <Download className="h-4 w-4" />
        Exportar tudo
      </button>
      <button
        type="button"
        onClick={() => setUploadOpen(true)}
        className={cn(
          'flex h-9 cursor-pointer items-center gap-2 rounded-xl px-4',
          'bg-blue-600 text-[13px] font-medium text-white',
          'shadow-[0_2px_8px_rgba(37,99,235,0.25)] transition-all',
          'hover:bg-blue-700 hover:-translate-y-px active:scale-[0.98]',
        )}
      >
        <Upload className="h-4 w-4" />
        Enviar documento
      </button>
    </div>
  )

  return (
    <>
      <Helmet title="Documentos - MindFlush" />

      <PatientsPageShell>
        <PatientsPageShell.Header
          title="Gestão de Documentos"
          description="Gerencie os anexos clínicos — busque, filtre, visualize e mantenha tudo organizado."
          icon={<FolderOpen className="size-6 text-blue-600" />}
        >
          {headerRight}
        </PatientsPageShell.Header>

        <PatientsPageShell.Content className="p-0">
          <MetricsCards meta={meta} />

          <div className="px-6 py-4">
            <PatientsDataBlock>
              <PatientsDataBlock.Header
                title="Documentos anexados"
                description={`Mostrando ${meta.totalCount > 0 ? Math.min(meta.perPage, meta.totalCount) : 0} de ${meta.totalCount} documentos`}
              />

              <PatientsDataBlock.Toolbar>
                <AttachmentsTableFilters
                  search={filters.search}
                  onSearchChange={filters.setSearch}
                  patientId={filters.patientId}
                  onPatientChange={filters.setPatientId}
                  date={filters.date}
                  onDateChange={filters.setDate}
                  contentType={filters.contentType}
                  onContentTypeChange={filters.setContentType}
                  onClearFilters={filters.clearFilters}
                />
              </PatientsDataBlock.Toolbar>

              <PatientsDataBlock.Content>
                <AttachmentsTable
                  attachments={attachments}
                  isLoading={isLoading}
                  onDelete={deleteFn}
                  onPreview={setPreviewDoc}
                  previewDocId={previewDoc?.id}
                />
              </PatientsDataBlock.Content>

              {meta.totalCount > 0 && (
                <PatientsDataBlock.Footer>
                  <PaginationDocsPatients
                    pageIndex={meta.pageIndex}
                    totalCount={meta.totalCount}
                    perPage={meta.perPage}
                    onPageChange={filters.setPageIndex}
                  />
                </PatientsDataBlock.Footer>
              )}
            </PatientsDataBlock>
          </div>
        </PatientsPageShell.Content>
      </PatientsPageShell>

      <PreviewDrawer
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDelete={(id) => {
          deleteFn(id)
          setPreviewDoc(null)
        }}
      />

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  )
}
