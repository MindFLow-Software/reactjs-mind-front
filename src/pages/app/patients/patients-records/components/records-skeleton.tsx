import { Skeleton } from '@/components/ui/skeleton'

export function RecordsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
      ))}
    </>
  )
}
