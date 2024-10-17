import React from "react";
import { Conversation } from "../../types/chat";

interface ChatItemProps {
  conversation: Conversation;
  onClick: () => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ conversation, onClick }) => {
  console.log("Conversation:", conversation);
  return (
    <div
      className="flex items-center p-3 w-full border-b cursor-pointer hover:bg-gray-100"
      onClick={onClick}
    >
      <img
        src={conversation.avatarUrl || "https://via.placeholder.com/112"}
        alt="Avatar"
        className="rounded-full w-12 h-12 object-cover border-4 border-blue-100 shadow-lg"
      />
      <div className="flex-1 max-w-72">
        <h3 className="font-semibold flex justify-between">
          {conversation.name}
          <span className="text-xs text-gray-500 ml-auto mt-1">
            {conversation.lastMessage
              ? conversation.lastMessage.createdAt
              : " "}
          </span>
        </h3>
        <p className="text-sm text-gray-600 truncate mt-1">
          {conversation.lastMessage ? (
            <>
              <span>
                {conversation.lastMessage.user.displayName.length > 15
                  ? conversation.lastMessage.user.displayName.slice(0, 15) +
                    "..."
                  : conversation.lastMessage.user.displayName}
                :{" "}
              </span>
              {conversation.lastMessage.content.length > 20
                ? conversation.lastMessage.content.slice(0, 20) + "..."
                : conversation.lastMessage.content}
            </>
          ) : (
            " "
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
