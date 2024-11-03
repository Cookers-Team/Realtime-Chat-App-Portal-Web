import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import { Conversation, Friends, UserProfile } from "../../types/chat";
import InputField from "../InputField";
import { Search, PlusCircle } from "lucide-react";

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  userCurrent: UserProfile | null;
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onSelectConversation,
  userCurrent,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-y-auto h-full">
      <h2 className="text-xl font-semibold m-4">Cuộc trò chuyện</h2>

      {filteredConversations.map((conversation) => (
        <ChatItem
          key={conversation._id}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation)}
          userCurrent={userCurrent}
        />
      ))}
    </div>
  );
};

export default ChatList;
