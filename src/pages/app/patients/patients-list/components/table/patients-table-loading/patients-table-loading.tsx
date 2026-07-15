import '../patients-columns.css'
import './patients-table-loading.css'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

type IPatientsTableLoading = {
  rows?: number
}

export function PatientsTableLoading({ rows = 10 }: IPatientsTableLoading) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={`skeleton-${index}`} className="ptbls-row">
          <TableCell className="ptc-checkbox">
            <Skeleton className="h-4 w-4 rounded" />
          </TableCell>

          <TableCell className="ptc-identity">
            <div className="ptbls-identity">
              <Skeleton className="ptbls-avatar" />
              <div className="ptbls-stack">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
          </TableCell>

          <TableCell className="ptc-status">
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>

          <TableCell className="ptc-contact">
            <div className="ptbls-stack">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
          </TableCell>

          <TableCell className="ptc-last-session">
            <Skeleton className="h-3 w-20" />
          </TableCell>

          <TableCell className="ptc-age">
            <div className="ptbls-stack">
              <Skeleton className="h-3.5 w-14" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </TableCell>

          <TableCell className="ptc-gender">
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>

          <TableCell className="ptc-actions">
            <div className="ptbls-actions">
              <Skeleton className="ptbls-action" />
              <Skeleton className="ptbls-action" />
              <Skeleton className="ptbls-action" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
