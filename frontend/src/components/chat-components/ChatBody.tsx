import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "@/stores/useChatStore"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatMessagesSkeleton from "../skeletons/ChatMessagesSkeleton";

const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const ChatBody = () => {
    const { user } = useUser();

    const { messages, selectedUser, isMessagesLoading } = useChatStore(useShallow(state => ({
        messages: state.messages,
        selectedUser: state.selectedUser,
        isMessagesLoading: state.isMessagesLoading
    })));

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatEndRef.current && messages)
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // todo: Add button that jumps to the end of the chat

    return (
        <ScrollArea className='h-[calc(100vh-300px)] pt-2'>
            <div className='px-4 space-y-2'>
                {isMessagesLoading ?
                    <ChatMessagesSkeleton />
                    :
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`flex items-start gap-3 ${message.senderID === user?.id && "flex-row-reverse"}`}
                        >
                            <Avatar className='size-7'>
                                <AvatarImage src={message.senderID === user?.id ? user?.imageUrl : selectedUser?.imageURL} />
                                <AvatarFallback>
                                    {message.senderID === user?.id ? user?.fullName?.[0] : selectedUser?.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className={`rounded-md py-2 px-3 max-w-[66%] ${message.senderID === user?.id ? "bg-indigo-950" : "bg-secondary"}`}>
                                <p>{message.contents}</p>
                                <small className='text-xs opacity-60 font-roboto font-light'>
                                    {formatTime(message.createdAt)}
                                </small>
                            </div>
                        </div>
                    ))
                }
                <div ref={chatEndRef} />
            </div>
        </ScrollArea>
    )
}

export default ChatBody;