'use client'

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FolderOpen, Download, Upload } from 'lucide-react'

import { Pagination } from '@/components/pagination/pagination'
import { useHeaderStore } from '@/store/use-header-store'
import { PatientsDataBlock } from '../components/patients-data-block/patients-data-block'
import { PatientsPageShell } from '../components/patients-page-shell/patients-page-shell'
import type { IAttachmentListItem as Attachment } from '@/types/attachment/attachment-list-item'

import { useAttachmentsFilters } from '@/hooks/use-attachments-filters'
import { useAttachmentsListQuery } from './hooks/use-attachments-list-query'
import { useDeleteAttachment } from './hooks/use-delete-attachment'
import { MetricsCards } from './components/metrics-cards'
import { AttachmentsTableFilters } from './components/attachments-table/attachments-table-filters'
import { AttachmentsTable } from './components/attachments-table'
import { PreviewDrawer } from './components/preview-drawer'
import { UploadModal } from './components/upload-modal'
import './patients-docs.css'

export function PatientDocuments() {
  const { setTitle } = useHeaderStore()
  const filters = useAttachmentsFilters()

  const [previewDoc, setPreviewDoc] = useState<Attachment | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  useEffect(() => {
    setTitle('Gestão de Documentos')
  }, [setTitle])

  const { attachments, meta, isLoading, isError } =
    useAttachmentsListQuery(filters)
  const { mutate: removeAttachment } = useDeleteAttachment()

  const handlePreviewDelete = (id: string) => {
    removeAttachment(id)
    setPreviewDoc(null)
  }

  if (isError) {
    return (
      <div className="pd-error">
        <p className="pd-error-title">Erro ao carregar documentos.</p>
        <button
          onClick={() => window.location.reload()}
          className="pd-error-retry"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  const headerRight = (
    <div className="pd-header-actions">
      <button type="button" disabled className="pd-btn-secondary">
        <Download className="size-4" />
        Exportar tudo
      </button>
      <button
        type="button"
        onClick={() => setUploadOpen(true)}
        className="pd-btn-primary"
      >
        <Upload className="size-4" />
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

          <div className="pd-content-body">
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
                  onDelete={removeAttachment}
                  onPreview={setPreviewDoc}
                  previewDocId={previewDoc?.id}
                />
              </PatientsDataBlock.Content>

              {meta.totalCount > 0 && (
                <PatientsDataBlock.Footer>
                  <Pagination
                    pagination={{
                      pageIndex: meta.pageIndex,
                      totalCount: meta.totalCount,
                      perPage: meta.perPage,
                      onPageChange: filters.setPageIndex,
                    }}
                    totalLabel="documentos arquivados"
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
        onDelete={handlePreviewDelete}
      />

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  )
}
