import { Skeleton } from "../ui/skeleton"

const UsersListSkeleton = () => {
    return (
        <div className="py-2 space-y-2">
            {[...Array<React.ReactNode>(6)].map((_, id) => (
                <div className="flex flex-1 items-center gap-2 px-3" key={id}>
                    <Skeleton className="rounded-full size-8 md:size-11" />
                    <Skeleton className="h-4 w-32" />
                </div>
            ))}
        </div>
    )
}

export default UsersListSkeleton