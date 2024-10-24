import React, { useEffect, useRef, useState } from 'react';
import Conversation from '../../Chat/Doctor/Conversation';
import Message from '../../Chat/Doctor/Message';
import Navbar from '../../Components/Doctor/Navbar/Navbar';
import { FiSend } from 'react-icons/fi';
import { useAppSelector } from '../../Redux/Store/Store';
import axiosJWT from '../../Utils/AxiosService';
import { CHAT_API, DOCTOR_API } from '../../Constants/Index';
import { useSocket } from '../../Context/SocketContext';

const Chat: React.FC = () => {
  const doctor = useAppSelector((state) => state.DoctorSlice);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [receiverData, setReceiverData] = useState<any | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [receiverId, setReceiverId] = useState<string | null>(null); // Added receiverId state

  
  const socket = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket?.on("getMessage", (data: any) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("senderTyping", (isTyping: boolean) => {
      setIsTyping(isTyping);
    });
  }, [socket]);

  useEffect(() => {
    socket?.on("updateLastMessage", (data: any) => {
      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) =>
          conversation._id === data.conversationId
            ? { ...conversation, lastMessage: data.lastMessage }
            : conversation
        );

        updatedConversations.sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.createdAt).getTime()
        );

        return updatedConversations;
      });
    });
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId)) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // useEffect(() => {
  //   socket?.emit("addUser", doctor.id);
  //   socket?.on("getUsers", (_users: any) => {});
  // }, [doctor, socket]);

  const emitTypingStatus = (isTyping: boolean) => {
    if (receiverId) {
      socket?.emit("typing", {
        receiverId,
        isTyping,
        userId: doctor.id,
      });
    }
  };

  const handleTypingStatus = (action: "focus" | "blur") => {
    emitTypingStatus(action === "focus");
  };


  // Load conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axiosJWT.get(`${CHAT_API}/conversations/${doctor.id}`);
        const conversationData: any = response.data;

        const updatedConversations = await Promise.all(
          conversationData.map(async (conversation: any) => {
            const messagesResponse: any = await axiosJWT.get(`${CHAT_API}/messages/${conversation._id}`);
            const messages = messagesResponse.data.messages;
            const lastMessage = messages[messages.length - 1];
            return { ...conversation, lastMessage };
          })
        );

        updatedConversations.sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.createdAt).getTime()
        );

        setConversations(updatedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    getConversations();
  }, [doctor.id]);

  // Load messages
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;
      try {
        const response: any = await axiosJWT.get(`${CHAT_API}/messages/${currentChat._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    getMessages();
  }, [currentChat]);


  const handleConversationClick = async (conversation: any) => {
    setCurrentChat(conversation);
    const id = conversation.members.find((member: any) => member !== doctor.id);
    setReceiverId(id); // Set receiverId state

    try {
      console.log('userId',id);
      
      const response: any = await axiosJWT.get(`${DOCTOR_API}/user/${id}`);
      setReceiverData(response.data?.user);
      console.log('userDat ',response.data?.user);
      
    } catch (error) {
      console.error("Error fetching receiver details:", error);
    }

    const lastMessageResponse: any = await axiosJWT.get(
      `${CHAT_API}/messages/${conversation._id}`
    );
    const lastMessageData = lastMessageResponse.data.messages.slice(-1)[0];
    setConversations((prevConversations) => {
      const updatedConversations = prevConversations.map((conv) =>
        conv._id === conversation._id ? { ...conv, lastMessage: lastMessageData } : conv
      );
      updatedConversations.sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
      );
      return updatedConversations;
    });
  };



  // Handle new message send
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage) return;
    const message = {
      senderId: doctor.id,
      text: newMessage,
      conversationId: currentChat?._id,
    };

    const receiverId = currentChat.members.find(
      (member: any) => member !== doctor.id
    );

    socket?.emit('sendMessage', {
      senderId: doctor.id,
      receiverId,
      text: newMessage,
      conversationId: currentChat?._id,
    });

    try {
      const response = await axiosJWT.post(`${CHAT_API}/messages`, message);
      setMessages([...messages, response.data]);
      setNewMessage('');

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) =>
          conversation._id === currentChat?._id
            ? { ...conversation, lastMessage: response.data }
            : conversation
        );

        updatedConversations.sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt).getTime() -
            new Date(a.lastMessage.createdAt).getTime()
        );

        return updatedConversations;
      });




    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="h-[664px] flex flex-col lg:flex-row">
        {/* Chat Menu */}
       
          <div className="w-full lg:w-1/4 bg-gray-200">
            <div className="p-4 h-full flex flex-col">
             
            {conversations.map((conversation, index) => (
              <div key={index} onClick={() => handleConversationClick(conversation)}>
                <Conversation
                  conversation={conversation}
                  lastMessage={conversation.lastMessage} isTyping={false} isOnline={false}                />
              </div>
            ))}
          </div>
        </div>
        

        {/* Chat Box */}
        <div className="w-full lg:w-3/4 bg-gray-100">
          <div className="flex flex-col h-full">
           
              
            <div className="h-full flex flex-col overflow-y-scroll pr-4">
            {!currentChat ? (
                <div className="text-center text-5xl text-gray-400 cursor-default mt-20 lg:mt-52">
                  Open a chat to start conversation..
                </div>
              ) : (
                <>
                  {messages.map((m, index) => (
                    <div className="flex-1" key={index} ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.senderId === doctor.id}
                        receiverProfilePicture={receiverData?.profilePicture}
                        receiverName={receiverData?.name}
                      />
                    </div>
                  ))}
                 <div className="flex items-center justify-center">
                    <small className="mr-1">{isTyping ? "Typing..." : ""}</small>
                  </div>
                  <div className="flex items-center">
                    <textarea
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onFocus={() => handleTypingStatus("focus")}
                      onBlur={() => handleTypingStatus("blur")}
                    />
                    <button
                      className="bg-blue-500 text-white px-3 py-1 ml-2 rounded-lg"
                      onClick={handleSubmit}
                    >
                      <FiSend />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
