import React from "react";
import { Conversation, UserProfile } from "../../types/chat";
import UserIcon from "../../assets/user_icon.png";
import { decrypt } from "../../types/utils";

interface ChatItemProps {
  conversation: Conversation;
  onClick: () => void;
  userCurrent: UserProfile | null;
  className?: string;
}

const ChatItem: React.FC<ChatItemProps> = ({
  conversation,
  onClick,
  userCurrent,
  className,
}) => {
  console.log("Conversation:", conversation);
  return (
    <div
      onClick={onClick}
      className={`
       flex items-center p-3 w-full border-b cursor-pointer hover:bg-gray-100
        ${className}
      `}
    >
      <img
        src={conversation.avatarUrl || UserIcon}
        alt="Avatar"
        className="rounded-full w-12 h-12 object-cover border-4 border-blue-100 shadow-lg"
      />
      <div className="flex-1 max-w-72 ml-2">
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
              {(() => {
                const decryptedContent = decrypt(
                  conversation.lastMessage.content,
                  userCurrent?.secretKey
                );
                return decryptedContent.length > 20
                  ? decryptedContent.slice(0, 20) + "..."
                  : decryptedContent;
              })()}
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
