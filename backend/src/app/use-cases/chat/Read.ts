import { ChatDbRepositoryInterace } from "../../Interfaces/ChatDbRepository";

export const getChats = async (
  senderId: string,
  chatRepository: ReturnType<ChatDbRepositoryInterace>
) => await chatRepository.getAllConversations(senderId);



export const getMessages = async (
    conversationID: string,
    chatRepository: ReturnType<ChatDbRepositoryInterace>
  ) =>
    await chatRepository.getPaginatedMessage(
        conversationID
    );
  
