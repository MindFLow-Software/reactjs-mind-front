'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import './loading.css'

export function PatientsDetailsLoading() {
  return (
    <div className="ph-loading">
      <header className="ph-loading__header">
        <div className="ph-loading__header-identity">
          <Skeleton className="ph-loading__sk-avatar" />
          <div className="ph-loading__header-name-group">
            <Skeleton className="ph-loading__sk-name" />
            <div className="ph-loading__header-badges">
              <Skeleton className="ph-loading__sk-badge-sm" />
              <Skeleton className="ph-loading__sk-badge-md" />
            </div>
          </div>
        </div>

        <div className="ph-loading__header-actions">
          <Skeleton className="ph-loading__sk-action-lg" />
          <Skeleton className="ph-loading__sk-action-sm" />
        </div>
      </header>

      <div className="ph-loading__metrics-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={`metric-skeleton-${i}`} className="bg-card shadow-sm">
            <CardHeader className="ph-loading__metric-header">
              <Skeleton className="ph-loading__sk-label" />
            </CardHeader>
            <CardContent className="ph-loading__metric-content">
              <Skeleton className="ph-loading__sk-metric-value" />
              <Skeleton className="ph-loading__sk-sub" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="clinical" className="ph-loading__tabs">
        <TabsList className="ph-loading__tabs-list">
          <TabsTrigger value="clinical" className="ph-loading__tab-trigger">
            Dados Clinicos
          </TabsTrigger>
          <TabsTrigger value="timeline" className="ph-loading__tab-trigger">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="docs" className="ph-loading__tab-trigger">
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinical" className="ph-loading__tab-content">
          <Card>
            <CardContent className="ph-loading__clinical-content">
              <div className="ph-loading__clinical-section">
                <Skeleton className="ph-loading__sk-section-title" />
                <div className="ph-loading__clinical-fields-grid">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={`clinical-field-${i}`}
                      className="ph-loading__sk-field"
                    />
                  ))}
                </div>
              </div>
              <div className="ph-loading__clinical-section">
                <Skeleton className="ph-loading__sk-section-title-lg" />
                <Skeleton className="ph-loading__sk-textarea" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="timeline"
          className="ph-loading__tab-content ph-loading__timeline-content"
        >
          <div className="ph-loading__timeline-filter">
            <Skeleton className="ph-loading__sk-wide-label" />
            <Skeleton className="ph-loading__sk-timeline-filter-value" />
          </div>
          <div className="ph-loading__timeline-list">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`timeline-${i}`} className="ph-loading__timeline-item">
                <Skeleton className="ph-loading__sk-label" />
                <Skeleton className="ph-loading__sk-timeline-title" />
                <Skeleton className="ph-loading__sk-timeline-body" />
                <div className="ph-loading__timeline-item-tags">
                  <Skeleton className="ph-loading__sk-timeline-tag" />
                  <Skeleton className="ph-loading__sk-timeline-tag" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="ph-loading__tab-content">
          <div className="ph-loading__docs-grid">
            <div className="ph-loading__docs-col">
              <Skeleton className="ph-loading__sk-wide-label" />
              <div className="ph-loading__docs-filter-box">
                <Skeleton className="ph-loading__sk-docs-filter-hint" />
                <Skeleton className="ph-loading__sk-docs-filter-btn" />
              </div>
              <div className="ph-loading__docs-upload-zone">
                <Skeleton className="ph-loading__sk-docs-upload-icon" />
                <Skeleton className="ph-loading__sk-docs-upload-label" />
                <Skeleton className="ph-loading__sk-sub" />
              </div>
            </div>

            <div className="ph-loading__docs-col">
              <Skeleton className="ph-loading__sk-docs-list-title" />
              <div className="ph-loading__docs-file-list">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={`doc-${i}`} className="ph-loading__docs-file-item">
                    <div className="ph-loading__docs-file-item-left">
                      <Skeleton className="ph-loading__sk-icon-sq" />
                      <Skeleton className="ph-loading__sk-label" />
                    </div>
                    <Skeleton className="ph-loading__sk-icon-sq" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
