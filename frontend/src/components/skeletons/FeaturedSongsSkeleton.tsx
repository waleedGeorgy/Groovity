import { Skeleton } from "../ui/skeleton"

const FeaturedSongsSkeleton = () => {
  return (
    [...Array<React.ReactNode>(6)].map((_, id) => (
      <div key={id} className="flex flex-row gap-3 rounded">
        <Skeleton className="size-25 rounded shrink-0 aspect-square" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))
  )
}

export default FeaturedSongsSkeleton