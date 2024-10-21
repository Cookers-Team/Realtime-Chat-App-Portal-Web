import React, { useState, useEffect } from "react";
import ChatItem from "./ChatItem";
import { Conversation, Friends } from "../../types/chat";
import InputField from "../InputField";
import { Search, PlusCircle } from "lucide-react";

interface ChatListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onCreateGroup: (
    groupName: string,
    avatarUrl: string,
    members: string[]
  ) => void;
  availableUsers: Friends[];
}

const ChatList: React.FC<ChatListProps> = ({
  conversations,
  onSelectConversation,
  onCreateGroup,
  availableUsers,
}) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateGroup = () => {
    if (groupName && selectedMembers.length > 0) {
      onCreateGroup(groupName, avatarUrl || "", selectedMembers);
      setGroupName("");
      setSelectedMembers([]);
      setAvatarUrl(null);
      setShowCreateGroup(false);
    } else {
      alert("Vui lòng nhập tên nhóm và chọn ít nhất một thành viên.");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAvatarUrl(fileUrl);
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // <div className="overflow-y-auto h-full">
    //   <div className="flex justify-between items-center m-4">
    //     <InputField
    //       placeholder="Tìm kiếm"
    //       value={searchQuery}
    //       onChange={(e: any) => setSearchQuery(e.target.value)}
    //       icon={Search}
    //     />
    //     <button
    //       className="text-blue-500 hover:text-blue-700 focus:outline-none"
    //       onClick={() => setShowCreateGroup(true)}
    //     >
    //       <PlusCircle className="w-6 h-6" />
    //     </button>
    //   </div>

    <div className="overflow-y-auto h-full">
      <h2 className="text-xl font-semibold m-4">Cuộc trò chuyện</h2>

      {showCreateGroup && (
        <div className="bg-white shadow-lg rounded-lg p-4 my-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Tạo nhóm</h3>
            <button
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
              onClick={() => setShowCreateGroup(false)}
            >
              X
            </button>
          </div>

          <InputField
            placeholder="Nhập tên nhóm"
            value={groupName}
            onChange={(e: any) => setGroupName(e.target.value)}
          />

          <div className="flex items-center mt-4">
            <label className="mr-2">Ảnh đại diện:</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            {avatarUrl && (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-10 h-10 rounded-full ml-2"
              />
            )}
          </div>

          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Chọn thành viên:</h4>
            <div className="max-h-40 overflow-y-auto">
              {availableUsers.map((user) => (
                <div key={user._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => {
                      if (selectedMembers.includes(user._id)) {
                        setSelectedMembers((prev) =>
                          prev.filter((id) => id !== user._id)
                        );
                      } else {
                        setSelectedMembers((prev) => [...prev, user._id]);
                      }
                    }}
                  />
                  <span className="ml-2">{user.friend.displayName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCreateGroup}
            >
              Tạo
            </button>
          </div>
        </div>
      )}

      {filteredConversations.map((conversation) => (
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
