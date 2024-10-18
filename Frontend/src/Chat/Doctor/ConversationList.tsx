import React, { useEffect, useState } from "react";
import axiosJWT from "../../Utils/AxiosService";
import { USER_API } from "../../Constants/Index";
import Conversation from "./Conversation";
import { useSocket } from "../../Context/SocketContext"; // Import the socket context

const ConversationsList: React.FC = () => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [typingStatus, setTypingStatus] = useState<{ [key: string]: boolean }>({}); // State to track typing status
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // State to track online users
    const socket = useSocket(); // Get the socket from the context

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response: any = await axiosJWT.get(`${USER_API}/conversations`);
                console.log('list of doctors', response);

                const sortedConversations = response.data.conversations.sort((a: any, b: any) => {
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                });
                setConversations(sortedConversations);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, []);

    // Handle typing status
    useEffect(() => {
        // Listen for "senderTyping" event from the socket
        socket?.on("senderTyping", (isTyping: boolean, senderId: string) => {
            setTypingStatus((prevStatus) => ({
                ...prevStatus,
                [senderId]: isTyping, // Update typing status for the specific sender
            }));
        });

        return () => {
            socket?.off("senderTyping"); // Cleanup the listener on component unmount
        };
    }, [socket]);

    // Handle online users status
    useEffect(() => {
        // Listen for "getUsers" event to get online users
        socket?.on("getUsers", (users: any[]) => {
            const onlineUserIds = users.map((user) => user.userId);
            setOnlineUsers(onlineUserIds); // Update the online users state
        });

        return () => {
            socket?.off("getUsers"); // Cleanup the listener on component unmount
        };
    }, [socket]);

    return (
        <div>
            {conversations.map((conversation) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastMessage={{
                        text: "",
                        senderId: "",
                        createdAt: "",
                    }}
                    // Pass the typing status to the conversation component
                    isTyping={typingStatus[conversation.members[0]] || false}
                    // Pass the online status based on the current members
                    isOnline={onlineUsers.includes(conversation.members[0])} // Check if the doctor/user is online
                />
            ))}
        </div>
    );
};

export default ConversationsList;
