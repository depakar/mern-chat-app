import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"], // Adjust this for your frontend URL
    methods: ["GET", "POST"],
  },
});

// User socket mapping
const userSocketMap = {}; // {userId: socketId}

// Function to get the receiver's socket ID
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  // Only add userId if it's defined
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User  ID ${userId} connected with socket ID ${socket.id}`);
  }

  // Emit the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log("User  disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      console.log(`User  ID ${userId} disconnected`);
    }
  });
});

// Exporting app, io, and server for use in other parts of the application
export { app, io, server };

// Start the server (you can do this in server.js or keep it here)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});