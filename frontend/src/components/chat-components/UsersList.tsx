import { useChatStore } from "@/stores/useChatStore"
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import UsersListSkeleton from "../skeletons/UsersListSkeleton";

const UsersList = () => {
    const { users, selectedUser, setSelectedUser, isLoading, onlineUsers } = useChatStore();

    return (
        <div className="h-full">
            <ScrollArea className='h-[calc(100vh-159px)] bg-secondary'>
                <div className='space-y-2'>
                    {isLoading ? (
                        <UsersListSkeleton />
                    ) : (
                        users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className={`flex flex-row items-center justify-center lg:justify-start gap-2 p-3
										cursor-pointer transition-colors ${selectedUser?.clerkID === user.clerkID ? "bg-indigo-900" : "hover:bg-indigo-900/40"}`}
                            >
                                <div className="relative">
                                    <Avatar className='size-8 md:size-10'>
                                        <AvatarImage src={user.imageURL} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`absolute bottom-0.5 right-0.5 size-2 rounded-full ring-1 ring-muted ${onlineUsers.has(user.clerkID) ? "bg-green-500" : "bg-zinc-600"}`}
                                    />
                                </div>
                                <div className='flex-1 min-w-0 lg:block hidden'>
                                    <span className='truncate'>{user.name}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

export default UsersList