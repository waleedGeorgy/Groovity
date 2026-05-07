import { Skeleton } from "../ui/skeleton"

const StatsCardsSkeleton = () => {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            {[...Array<React.ReactNode>(4)].map((_, id) => (
                <Skeleton key={id} className="w-52 h-[94px] rounded-xl shrink-0" />
            ))}
        </div>
    )
}

export default StatsCardsSkeleton