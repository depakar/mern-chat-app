import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
    const { authUser  } = useAuthContext();
    const { selectedConversation } = useConversation();
    const fromMe = message.senderId === authUser ._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";
    const profilePic = fromMe ? authUser .profilePic : selectedConversation?.profilePic;
    const bubbleBgColor = fromMe ? "bg-blue-500" : "";

    // Effect to mark the message as seen when the component mounts
    useEffect(() => {
        if (!fromMe && !message.seen) {
            markMessageAsSeen(message._id);
        }
    }, [message, fromMe]);

    const markMessageAsSeen = async (messageId) => {
        try {
            await fetch(`/api/messages/${messageId}/seen`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Failed to mark message as seen:", error);
        }
    };

    return (
        <div className={`chat ${chatClassName}`}>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='User  Avatar' src={profilePic} />
                </div>
            </div>
            <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>
                {message.message}
                {message.seen && <span className="seen-status">✓</span>} {/* Show seen status */}
            </div>
            <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>
                {formattedTime}
            </div>
        </div>
    );
};

export default Message;