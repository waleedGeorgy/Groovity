import { Skeleton } from "../ui/skeleton"

const ChatMessagesSkeleton = () => {
    return (
        [...Array<React.ReactNode>(8)].map((_, id) => (
            <div
                key={id}
                className={`flex items-start gap-3 ${id % 2 === 0 ? "flex-row-reverse" : ""}`}
            >
                <Skeleton className="size-7 rounded-full" />
                <Skeleton className="rounded-md h-16 w-48" />
            </div>
        )
        )
    )

}

export default ChatMessagesSkeleton