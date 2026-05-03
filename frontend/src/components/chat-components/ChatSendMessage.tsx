import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useShallow } from "zustand/react/shallow";

const ChatSendMessage = () => {
    const [newMessage, setNewMessage] = useState("");

    const { user } = useUser();

    const { selectedUser, sendMessage } = useChatStore(useShallow(state => ({
        selectedUser: state.selectedUser,
        sendMessage: state.sendMessage
    })));

    const handleSendMessage = () => {
        if (!selectedUser || !user || !newMessage) return;
        sendMessage(user.id, selectedUser.clerkID, newMessage.trim());
        setNewMessage("");
    }

    return (
        <div className='p-3 mt-auto'>
            <div className='flex items-center gap-2'>
                <Input
                    placeholder='Message'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="border-none"
                    autoFocus
                />
                <Button size="icon" className="bg-indigo-500 hover:bg-indigo-400 cursor-pointer transition-all duration-300 rounded-full" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className='size-4' />
                </Button>
            </div>
        </div>
    )
}

export default ChatSendMessage