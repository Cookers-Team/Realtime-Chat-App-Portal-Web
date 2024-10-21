import React, { useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import AddFriend from "./AddFriend";

interface FriendListItemProps {
  selectedFriendSection: string;
  setSelectedFriendSection: (section: string) => void;
}

const FriendListItem: React.FC<FriendListItemProps> = ({
  selectedFriendSection,
  setSelectedFriendSection,
}) => {
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

//   // Hàm để mở/đóng thêm bạn bè
//   const toggleAddFriend = () => {
//     setIsAddFriendOpen(!isAddFriendOpen);
//   };
  return (
    <div className="p-4 flex flex-col justify-start">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bạn bè"
          className="pl-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={() => setIsAddFriendOpen(true)}
          >
            <UserPlus size={24} />
          </div>
      </div>

      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedFriendSection === "friends" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedFriendSection("friends")}
      >
        <Users size={24} className="mr-2" />
        <p className="text-lg">Danh sách bạn bè</p>
      </div>
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedFriendSection === "groups" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedFriendSection("groups")}
      >
        <Users size={24} className="mr-2" />
        <p className="text-lg">Danh sách nhóm</p>
      </div>
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedFriendSection === "requests" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedFriendSection("requests")}
      >
        <UserPlus size={24} className="mr-2" />
        <p className="text-lg">Lời mời kết bạn</p>
      </div>
      <AddFriend
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
    </div>
    
  );
};

export default FriendListItem;