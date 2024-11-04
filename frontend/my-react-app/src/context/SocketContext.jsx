import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import { io } from "socket.io-client"; // Ensure you import io from socket.io-client

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser  } = useAuthContext();

  useEffect(() => {
    // Create socket instance
    let socketInstance;

    if (authUser ) {
      // Use HTTP or HTTPS based on your backend setup
      socketInstance = io("http://localhost:5000", { // Change to https if your server uses SSL
        query: {
          userId: authUser ._id,
        },
      });

      // Listen for online users
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // Handle socket errors
      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(socketInstance);
    }

    // Cleanup function to close the socket connection
    return () => {
      if (socketInstance) {
        socketInstance.disconnect(); // Use disconnect instead of close
        socketInstance.removeAllListeners();
      }
    };
  }, [authUser ]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};