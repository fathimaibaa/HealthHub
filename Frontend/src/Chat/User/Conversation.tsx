import React, { useEffect, useState } from "react";
import axiosJWT from "../../Utils/AxiosService";
import { USER_API } from "../../Constants/Index";

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
    };
    isTyping: boolean; // Add typing status prop
}

const Conversation: React.FC<ConversationProps> = ({ conversation, lastMessage, isTyping }) => {
    const [doctorData, setDoctorData] = useState<any>({});

    // Fetch doctor data based on conversation member ID
    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const doctorId = conversation.members[1]; // Assuming the second member is the doctor
                const response: any = await axiosJWT.get(`${USER_API}/doctor/${doctorId}`);
                setDoctorData(response.data.doctor);
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        fetchDoctorData();
    }, [conversation]);

    return (
        <div className="bg-white rounded-lg shadow-md p-2 flex flex-col mb-1">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                <img
                    className="w-14 h-14 rounded-full object-cover mb-2 sm:mb-0 sm:mr-4"
                    src={doctorData.profileImage}
                    alt="Doctor Profile"
                />
                <div className="flex flex-col text-center sm:text-left">
                    <span className="font-medium">{doctorData.doctorName}</span>
                    {isTyping ? (
                        <span className="text-gray-500 text-sm italic">Typing...</span>
                    ) : (
                        <span className="text-gray-500 text-sm">{lastMessage?.text || "No messages yet"}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Conversation;
