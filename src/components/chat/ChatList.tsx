import React from "react";
import ChatItem from "./ChatItem";
import { Conversation } from "../../types/chat";
import InputField from "../InputField";
import { Search } from "lucide-react";

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onSelectConversation,
}) => {
  return (
    <div className="overflow-y-auto h-full">
      <h2 className="text-xl font-semibold m-4">Cuộc trò chuyện</h2>
      {conversations.map((conversation) => (
        <ChatItem
          key={conversation._id}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </div>
  );
};

export default ChatList;
