import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/messages/${selectedConversation._id}`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);

				// Mark messages as seen after fetching them
				await markMessagesAsSeen(data);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, setMessages]);

	const markMessagesAsSeen = async (messages) => {
		try {
			for (const message of messages) {
				if (!message.seen) {
					await fetch(`/api/messages/seen/${message._id}`, {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${yourAuthToken}`, // Add your auth token if needed
						},
					});
				}
			}
		} catch (error) {
			toast.error("Failed to mark messages as seen");
		}
	};

	return { messages, loading };
};

export default useGetMessages;