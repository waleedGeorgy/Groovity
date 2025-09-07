import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Headphones, Music4, Users } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore"
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UsersPanel = () => {
    // todo: add loading state
    const { users, getAllUsers, onlineUsers, usersActivity } = useChatStore();

    const { user } = useUser();

    useEffect(() => {
        if (user) void getAllUsers();
    }, [getAllUsers, user]);

    return (
        <div className="bg-card border rounded-lg">
            {user ?
                (<div className="h-full">
                    <div className="flex flex-row items-center gap-2 p-4">
                        <Users className="size-5 shrink-0 truncate" />
                        <h2 className="hidden md:inline-block truncate">Friends activity</h2>
                    </div>
                    <Separator className="my-0 max-w-[75%] mx-auto" />
                    <ScrollArea className="flex-1 h-[calc(100vh-10rem)]">
                        <div className='p-2 space-y-2'>
                            {users.map((user) => {
                                const activity = usersActivity.get(user.clerkID);
                                const isPlaying = activity && activity !== "Idle"

                                const playingSong = activity?.replace("Playing ", "").split("by ")[0];
                                const playingArtist = activity?.split("by ")[1];

                                return (
                                    <div
                                        key={user._id}
                                        className='rounded-md transition-colors duration-300 p-2 group'
                                    >
                                        <div className='flex items-start gap-3'>
                                            <div className='relative'>
                                                <Avatar className='size-10 outline'>
                                                    <AvatarImage src={user.imageURL} alt={user.name} />
                                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div
                                                    className={`absolute bottom-0.5 right-0 size-2 ${onlineUsers.has(user.clerkID) ? "bg-green-500" : "bg-zinc-600"}  outline-1 outline-background rounded-full`}
                                                    aria-hidden='true'
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='text-sm truncate'>{user.name}</span>
                                                    {isPlaying && <Music4 className='size-4 text-indigo-500 shrink-0 animate-wiggle' />}
                                                </div>
                                                {isPlaying ? (
                                                    <div className='mt-1'>
                                                        <div className='text-sm font-semibold truncate'>
                                                            {playingSong}
                                                        </div>
                                                        <div className='text-xs opacity-60 truncate'>
                                                            {playingArtist}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='mt-1 text-xs opacity-60'>Idle</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </div>)
                :
                (<div className='h-[calc(100vh-(103px))] flex flex-col items-center justify-center text-center space-y-4'>
                    <div className='relative'>
                        <div
                            className='absolute -inset-1 bg-conic from-indigo-500 via-emerald-500 to-yellow-500 rounded-full blur-md opacity-85 animate-spin'
                            aria-hidden="true" />
                        <div className='relative bg-card rounded-full p-4'>
                            <Headphones className='size-8 text-indigo-500' />
                        </div>
                    </div>
                    <div>
                        <h3 className='font-semibold font-roboto truncate'>Log In</h3>
                        <h4 className="text-sm truncate">to see what others are listening to!</h4>
                    </div>
                </div >)}
        </div >
    )
}

export default UsersPanel