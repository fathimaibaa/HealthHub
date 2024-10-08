import { Server } from "socket.io";

interface SocketUserInterface {
  userId: string;
  socketId: any;
}

const socketConfig = (io: Server) => {
  let users: SocketUserInterface[] = [];

  function addUser(userId: string, socketId: string) {
    const isUserPresent = users.some((user) => user.userId === userId);
    if (!isUserPresent) return users.push({ userId, socketId });
  }

  function removeUser(socketId: string) {
    return (users = users.filter((user) => user.socketId !== socketId));
  }

  function getUser(userId: string) {
    return users.find((user) => user.userId === userId);
  }

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        conversationId,
      });

      io.emit("updateLastMessage", { conversationId: conversationId, lastMessage: { text, senderId, createdAt: Date.now() } });
    });

    socket.on("typing", ({ receiverId, isTyping, userId }) => {
      const user = getUser(receiverId)

      io.to(user?.socketId ?? "").emit("senderTyping", isTyping, userId)
    })

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log("A user has been disconnected");
      io.emit("getUsers", users);
    });
  });
};

export default socketConfig;
