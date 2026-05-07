import { X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { AvatarFallback } from "@radix-ui/react-avatar"
import { useChatStore } from "@/stores/useChatStore"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button";

const ChatHeader = () => {
    const { selectedUser, onlineUsers, setSelectedUser } = useChatStore(useShallow(state => ({
        selectedUser: state.selectedUser,
        onlineUsers: state.onlineUsers,
        setSelectedUser: state.setSelectedUser
    })));

    if (!selectedUser) return;

    return (
        <header className="p-3 bg-indigo-950">
            <div className="flex flex-row items-center justify-between gap-1 flex-wrap">
                <div className="flex flex-row items-center gap-2">
                    <Avatar className="size-7 md:size-9">
                        <AvatarImage src={selectedUser?.imageURL} alt={selectedUser?.name} />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center">
                        <h2 className="hidden sm:text-xs sm:inline-block md:text-sm font-semibold">{selectedUser?.name}</h2>
                        <p className="hidden sm:inline-block text-xs">{onlineUsers.has(selectedUser?.clerkID) ? ("Online") : ("Offline")}</p>
                    </div>
                </div>
                <div>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="size-7 cursor-pointer rounded-full border hover:scale-110 hover:bg-red-500"
                        onClick={() => { setSelectedUser(null) }}
                    >
                        <X className="size-3" />
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default ChatHeader