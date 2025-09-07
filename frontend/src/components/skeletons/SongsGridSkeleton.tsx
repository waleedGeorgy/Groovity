import { Skeleton } from "../ui/skeleton"

const SongsGridSkeleton = () => {
  return (
    [...Array<React.ReactNode>(4)].map((_, id) => (
      <div key={id} className="flex flex-col gap-3 rounded-md">
        <Skeleton className="size-52 rounded shrink-0" />
        <div className="pb-1 space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    ))
  )
}

export default SongsGridSkeleton