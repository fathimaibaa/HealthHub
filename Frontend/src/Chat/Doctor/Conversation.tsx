import React, { useEffect, useState } from "react";
import axiosJWT from "../../Utils/AxiosService";
import { DOCTOR_API } from "../../Constants/Index";
import { useSocket } from "../../Context/SocketContext"; // Assuming socketContext is set up

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
  isOnline: boolean;
}

const Conversation: React.FC<ConversationProps> = ({ conversation, lastMessage  }) => {
  console.log('props',conversation, lastMessage);
  
  const [userData, setUserData] = useState<any>({});
  const [isTyping, setIsTyping] = useState(false); // State to track typing status
  const [isOnline, setIsOnline] = useState(false); // State to track online status
  const socket = useSocket(); // Socket context to manage socket connection

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userId = conversation.members[0]; // Assuming the doctor is the first member
        const response: any = await axiosJWT.get(`${DOCTOR_API}/user/${userId}`);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDoctorData();
  }, [conversation, lastMessage]);

  // Listen for typing events
  useEffect(() => {
    const receiverId = conversation.members[0]; // Assuming the doctor is the receiver
    socket?.on("senderTyping", (isTyping: boolean, senderId: string) => {
      console.log('sender event res',isTyping,senderId);
      
      if (senderId === receiverId) {
        console.log('inside the condiyiojn', isTyping);
        
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket?.off("senderTyping"); // Cleanup event listener on unmount
    };
  }, [socket, conversation]);
  useEffect(()=>{
console.log('isTyping in useEffect',isTyping);

  },[isTyping])

  // Listen for online status
  useEffect(() => {
    const receiverId = conversation.members[0]; // Assuming the doctor is the receiver

    // Listen to "getUsers" event from the socket to get online users
    socket?.on("getUsers", (users: any[]) => {
      // Check if the current doctor is online
      const isOnline = users.some((user) => user.userId === receiverId);
      setIsOnline(isOnline); // Update the online status
    });

    return () => {
      socket?.off("getUsers"); // Cleanup event listener on unmount
    };
  }, [socket, conversation]);

  return (
    <div className="bg-white rounded-lg shadow-md p-2 flex flex-col mb-1">
        <div className="flex flex-col  sm:flex-row items-center sm:items-start">
                <img
                    className="w-14 h-14 rounded-full object-cover mb-2 sm:mb-0 sm:mr-4"
                    src={userData.profilePicture} 
                    alt="Doctor Profile"
                />
                <div className="flex flex-col text-center sm:text-left">
                    <span className="font-medium">{userData.name}</span>
                    <span className="text-gray-500 text-sm">{lastMessage?.text}</span>
                </div>
            </div>

          {/* Online status indicator */}
          {isOnline ? (
            <span className="text-green-500 text-sm">Online</span>
          ) : (
            <span className="text-gray-500 text-sm">Offline</span>
          )}

          {/* Display the typing status or last message */}
          {isTyping  && (
            <span className="text-gray-500 text-sm italic">Typing...</span>
          ) }
        </div>
  
  );
};

export default Conversation;
