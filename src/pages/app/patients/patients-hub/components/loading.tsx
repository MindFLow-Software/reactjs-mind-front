'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PatientsDetailsLoading() {
  return (
    <div className="flex flex-col gap-6 p-6 bg-background min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-8 w-44 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={`metric-skeleton-${i}`} className="bg-card shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="clinical" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[600px] bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="clinical" className="rounded-lg">
            Dados Clinicos
          </TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-lg">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="docs" className="rounded-lg">
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinical" className="mt-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton
                      key={`clinical-field-${i}`}
                      className="h-4 w-full"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6 space-y-4">
          <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`timeline-${i}`} className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-40" />
              <div className="p-4 rounded-xl border border-muted/40 space-y-3">
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="border rounded-xl p-6 border-dashed space-y-3">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={`doc-${i}`}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
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
