import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { useEffect, useRef } from "react";

const Conversations = ({ onSelectConversation }) => {
	const { loading, conversations } = useGetConversations();
	const conversationsRef = useRef(null);

	// Sort conversations by the latest message time
	const sortedConversations = [...conversations].sort((a, b) => {
		const aLastMessageTime = a.messages.length > 0 ? a.messages[a.messages.length - 1].createdAt : 0;
		const bLastMessageTime = b.messages.length > 0 ? b.messages[b.messages.length - 1].createdAt : 0;
		return new Date(bLastMessageTime) - new Date(aLastMessageTime);
	});

	useEffect(() => {
		if (conversationsRef.current) {
			conversationsRef.current.scrollTop = conversationsRef.current.scrollHeight;
		}
	}, [conversations]);

	return (
		<div className="conversations-list" ref={conversationsRef} style={{ overflowY: 'auto', maxHeight: '500px' }}>
			{loading ? (
				<p>Loading conversations...</p>
			) : (
				sortedConversations.map((conversation, index) => (
					<Conversation
						key={conversation._id}
						conversation={conversation}
						lastIdx={index === sortedConversations.length - 1}
						onSelect={() => onSelectConversation(conversation)}
					/>
				))
			)}
		</div>
	);
};

export default Conversations;