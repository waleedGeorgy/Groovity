import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useShallow } from "zustand/react/shallow";
import { useChatStore } from "@/stores/useChatStore"
import TopBar from "@/components/TopBar";
import UsersList from "@/components/chat-components/UsersList";
import logo from "../../public/icon.png";
import ChatHeader from "@/components/chat-components/ChatHeader";
import ChatBody from "@/components/chat-components/ChatBody";
import ChatSendMessage from "@/components/chat-components/ChatSendMessage";

const ChatPage = () => {
    const { user } = useUser();

    const { fetchMessages, getAllUsers, selectedUser } = useChatStore(useShallow(state => ({
        fetchMessages: state.fetchMessages,
        getAllUsers: state.getAllUsers,
        selectedUser: state.selectedUser
    })));

    useEffect(() => {
        if (user) void getAllUsers();
    }, [getAllUsers, user]);

    useEffect(() => {
        if (selectedUser) void fetchMessages(selectedUser.clerkID);
    }, [fetchMessages, selectedUser])

    return (
        <div className="rounded-lg overflow-hidden bg-card border">
            <TopBar />
            <div className="grid lg:grid-cols-[1fr_250px] grid-cols-[1fr_90px]">
                {selectedUser ?
                    <div className="flex flex-col flex-1 h-full">
                        <ChatHeader />
                        <ChatBody />
                        <ChatSendMessage />
                    </div>
                    :
                    <div className="flex flex-1 flex-col justify-center items-center gap-4">
                        <div className="relative">
                            <div
                                className='absolute -inset-1.5 bg-conic from-indigo-500 via-emerald-500 to-yellow-500 rounded-full blur-md opacity-85 animate-spin'
                                aria-hidden="true"
                            />
                            <img src={logo} alt="Logo of Groovity" className="size-14 animate-wiggle" />
                        </div>
                        <div className="text-center">
                            <h2 className="font-roboto text-xl">No active conversation.</h2>
                            <p className="opacity-60 text-sm">Select a friend and start chatting!</p>
                        </div>
                    </div>
                }
                <UsersList />
            </div>
        </div>
    )
}

export default ChatPage