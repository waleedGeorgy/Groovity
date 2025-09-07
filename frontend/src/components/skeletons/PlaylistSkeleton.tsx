import { Skeleton } from "../ui/skeleton"

const PlaylistSkeleton = () => {
    return (
        <div className="space-y-3 p-2">
            {[...Array<React.ReactNode>(9)].map((_, id) => (
                <div className="flex items-center gap-3" key={id}>
                    <Skeleton className="size-12 rounded-md bg-background" />
                    <div className="space-y-2 hidden md:block">
                        <Skeleton className="h-5 w-24 bg-background" />
                        <Skeleton className="h-4 w-12 bg-background" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PlaylistSkeleton