import { Server } from "socket.io";

interface SocketUserInterface {
  userId: string;
  socketId: string;
}

const socketConfig = (io: Server) => {
  let users: SocketUserInterface[] = [];

  // Add user if not present
  function addUser(userId: string, socketId: string) {
    const isUserPresent = users.some((user) => user.userId === userId);
    if (!isUserPresent) users.push({ userId, socketId });
  }

  // Remove user when they disconnect
  function removeUser(socketId: string) {
    users = users.filter((user) => user.socketId !== socketId);
  }

  // Get user by their ID
  function getUser(userId: string) {
    return users.find((user) => user.userId === userId);
  }

  // Get all online users
  function getOnlineUsers() {
    return users.map((user) => user.userId);
  }

  io.on("connection", (socket) => {
    console.log("User connected");

    // When user connects, add them to the users array
    socket.on("addUser", (userId: string) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users); // Notify all users of online status
    });

    // Listen for messages and forward them to the receiver
    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
          conversationId,
        });
      }
      io.emit("updateLastMessage", { conversationId, lastMessage: { text, senderId, createdAt: Date.now() } });
    });

    // Handle typing status
    socket.on("typing", ({ receiverId, isTyping, userId }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("senderTyping", isTyping, userId);
      }
    });

    // When user disconnects, remove them from users array
    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("A user has been disconnected");
      io.emit("getUsers", users); // Notify all users of online status
    });
  });
};

export default socketConfig;
