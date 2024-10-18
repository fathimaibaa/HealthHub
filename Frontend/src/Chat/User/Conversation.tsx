import React, { useEffect, useState } from "react";
import axiosJWT from "../../Utils/AxiosService";
import { USER_API } from "../../Constants/Index";
import { useSocket } from "../../Context/SocketContext"; // Import your socket context

interface ConversationProps {
  conversation: {
    _id: string;
    createdAt: string;
    members: string[];
    updatedAt: string;
    __v: number;
  };
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: string;
  };
  isTyping: boolean;
  isOnline: boolean; // Online status prop
}

const Conversation: React.FC<ConversationProps> = ({ conversation, lastMessage }) => {
    const [doctorData, setDoctorData] = useState<any>({});

  const socket = useSocket(); // Access the socket from context
  const [isTyping, setIsTyping] = useState(false); // Local typing state
  const [isOnline, setIsOnline] = useState(false); // State to track online status

  // Fetch user data based on conversation member ID (assume user is the second member)
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const doctorId = conversation.members[1];
        // Assuming the user is the first member
        const response:any = await axiosJWT.get(`${USER_API}/doctor/${doctorId}`);

        setDoctorData(response.data.doctor);
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        fetchDoctorData();

  }, [conversation]);

  // Listen to typing events from the user
  useEffect(() => {
    socket?.on("senderTyping", (typingStatus: boolean, senderId: string) => {
      if (senderId === conversation.members[0]) { // Assuming the user is the sender
        setIsTyping(typingStatus); // Update typing status
      }
    });

    return () => {
      socket?.off("senderTyping"); // Cleanup the event listener on unmount
    };
  }, [socket, conversation.members]);

  // Listen for online status updates
  useEffect(() => {
    const userId = conversation.members[0]; // Assuming the user is the first member

    socket?.on("getUsers", (users: any[]) => {
      // Check if the user is online
      const isUserOnline = users.some((user) => user.userId === userId);
      setIsOnline(isUserOnline);
    });

    return () => {
      socket?.off("getUsers"); // Cleanup the event listener on unmount
    };
  }, [socket, conversation.members]);

  return (
    <div className="bg-white rounded-lg shadow-md p-2 flex flex-col mb-1">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <img
          className="w-14 h-14 rounded-full object-cover mb-2 sm:mb-0 sm:mr-4"
          src={doctorData.profileImage}

          alt="Doctor Profile Profile"
        />
        <div className="flex flex-col text-center sm:text-left">
          <span className="font-medium">{doctorData.doctorName}</span>

          {/* Display online/offline status */}
          <span className={`text-sm ${isOnline ? "text-green-500" : "text-gray-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>

          {/* Display typing status or last message */}
          {isTyping ? (
            <span className="text-gray-500 text-sm italic">User is typing...</span>
          ) : (
            <span className="text-gray-500 text-sm">{lastMessage?.text || "No messages yet"}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
