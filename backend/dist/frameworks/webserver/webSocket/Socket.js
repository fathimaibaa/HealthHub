"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketConfig = (io) => {
    let users = [];
    // Add user if not present
    function addUser(userId, socketId) {
        const isUserPresent = users.some((user) => user.userId === userId);
        if (!isUserPresent)
            users.push({ userId, socketId });
    }
    // Remove user when they disconnect
    function removeUser(socketId) {
        users = users.filter((user) => user.socketId !== socketId);
    }
    // Get user by their ID
    function getUser(userId) {
        return users.find((user) => user.userId === userId);
    }
    // Get all online users
    function getOnlineUsers() {
        return users.map((user) => user.userId);
    }
    io.on("connection", (socket) => {
        console.log("User connected");
        // When user connects, add them to the users array
        socket.on("addUser", (userId) => {
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
exports.default = socketConfig;
