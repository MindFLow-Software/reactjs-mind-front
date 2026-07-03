import { Skeleton } from '@/components/ui/skeleton'
import './records-skeleton.css'

export function RecordsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="pr-skel-card" />
      ))}
    </>
  )
}
