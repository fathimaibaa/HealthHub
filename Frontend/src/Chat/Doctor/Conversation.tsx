import React, { useEffect, useState } from "react";
import axiosJWT from "../../Utils/AxiosService";
import { DOCTOR_API } from "../../Constants/Index";
import { useSocket } from "../../Context/SocketContext"; // Assuming you're using a SocketContext

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
}

const Conversation: React.FC<ConversationProps> = ({ conversation, lastMessage }) => {
  const [userData, setUserData] = useState<any>({});
  const [isTyping, setIsTyping] = useState<boolean>(false); // State to track typing status
  const socket = useSocket(); // Get socket instance from context

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userId = conversation.members[0]; // Get the first member (assuming it's the doctor)
        const response: any = await axiosJWT.get(`${DOCTOR_API}/user/${userId}`);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [conversation]);

  // Listen for typing events
  useEffect(() => {
    if (socket) {
      // Assuming `conversation._id` is used to differentiate between chats
      socket.on("typing", (data: { conversationId: string; isTyping: boolean }) => {
        if (data.conversationId === conversation._id) {
          setIsTyping(data.isTyping);
        }
      });
    }

    // Cleanup event listener on component unmount
    return () => {
      socket?.off("typing");
    };
  }, [conversation._id, socket]);

  return (
    <div className="bg-white rounded-lg shadow-md p-2 flex flex-col mb-1">
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        <img
          className="w-14 h-14 rounded-full object-cover mb-2 sm:mb-0 sm:mr-4"
          src={userData.profilePicture}
          alt="Doctor Profile"
        />
        <div className="flex flex-col text-center sm:text-left">
          <span className="font-medium">{userData.name}</span>
          {/* Show typing status if the doctor is typing */}
          {isTyping ? (
            <span className="text-gray-500 text-sm italic">Typing...</span>
          ) : (
            <span className="text-gray-500 text-sm">{lastMessage?.text}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;
