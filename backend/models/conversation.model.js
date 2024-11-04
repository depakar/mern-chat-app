
import mongoose from 'mongoose';
const conversationSchema = new mongoose.Schema(
	{
	  participants: [
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "User",
		},
	  ],
	  messages: [
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "Message",
		  default: [],
		},
	  ],
	  lastMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Message",
	  },
	  unreadCounts: [
		{
		  userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		  },
		  count: {
			type: Number,
			default: 0,
		  },
		},
	  ],
	  lastReadTimestamps: [
		{
		  userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		  },
		  lastRead: {
			type: Date,
			default: null,
		  },
		},
	  ],
	},
	{ timestamps: true }
  );
  
  conversationSchema.index({ participants: 1 });
  
  const Conversation = mongoose.model("Conversation", conversationSchema);
  
  export default Conversation;
  