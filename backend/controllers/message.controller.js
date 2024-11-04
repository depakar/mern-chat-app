// message.controller.js
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // Create conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create the new message
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Add the new message to the conversation's messages array
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Update unreadCounts for the receiver
        const receiverIndex = conversation.unreadCounts.findIndex(
            (count) => count.userId.toString() === receiverId.toString()
        );

        if (receiverIndex !== -1) {
            // Increment the unread count if the entry exists
            conversation.unreadCounts[receiverIndex].count += 1;
        } else {
            // Add a new unread count entry if it doesn't exist
            conversation.unreadCounts.push({ userId: receiverId, count: 1 });
        }

        // Save both conversation and new message in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        // Find the conversation with messages populated
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        // Update lastReadTimestamps for the sender
        const senderIndex = conversation.lastReadTimestamps.findIndex(
            (timestamp) => timestamp.userId.toString() === senderId.toString()
        );

        if (senderIndex !== -1) {
            // Update the existing last read timestamp
            conversation.lastReadTimestamps[senderIndex].lastRead = new Date();
        } else {
            // Add a new last read timestamp entry if it doesn't exist
            conversation.lastReadTimestamps.push({
                userId: senderId,
                lastRead: new Date(),
            });
        }

        // Reset unread count for the sender to 0
        const senderUnreadIndex = conversation.unreadCounts.findIndex(
            (count) => count.userId.toString() === senderId.toString()
        );

        if (senderUnreadIndex !== -1) {
            // Reset the count to 0
            conversation.unreadCounts[senderUnreadIndex].count = 0;
        }

        // Save conversation updates
        await conversation.save();

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// New function to mark a message as seen
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id: messageId } = req.params;

        // Find the message and update the seen status
        const updatedMessage = await Message.findByIdAndUpdate(
            messageId,
            { seen: true },
            { new: true } // Return the updated document
        );

		if (!updatedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json(updatedMessage);
    } catch (error) {
        console.log("Error in markMessageAsSeen controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
           