import React from "react";
import ChatItem from "./ChatItem";
import { Conversation } from "../../types/chat";

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
      <h2 className="text-xl font-semibold mb-4">Conversations</h2>
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
