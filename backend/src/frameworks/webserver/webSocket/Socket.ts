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
    console.log('isuserpresent',isUserPresent);
    
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
      console.log('addYUser',userId);
      console.log(userId);
      
      addUser(userId, socket.id);
      console.log(users);
      
      io.emit("getUsers", users); // Notify all users of online status
    });

    // Listen for messages and forward them to the receiver
    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
      const user = getUser(receiverId);
      if (user) {
        // Send the message to the receiver
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
          conversationId,
        });

        // Send a notification to the receiver
        io.to(user.socketId).emit("getNotification", {
          senderId,
          message: `New message from ${senderId}`,
          type: "message",
          conversationId,
          createdAt: Date.now(),
        });
      }
      // Optionally, emit an update for the last message in conversation
      io.emit("updateLastMessage", {
        conversationId,
        lastMessage: { text, senderId, createdAt: Date.now() },
      });
    });

    // Handle typing status
    socket.on("typing", ({ receiverId, isTyping, userId }) => {
      console.log('typing event in backend',receiverId, isTyping, userId);
      
      const user = getUser(receiverId);
      console.log('usersdockert',user);
      
      if (user) {
        console.log('inm=',users);
        
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
