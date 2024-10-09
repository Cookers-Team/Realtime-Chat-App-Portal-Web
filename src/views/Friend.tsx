import React, { useState } from "react";
import NavBar from "../components/NavBar";
import FriendsList from "../components/friend/FriendsList";
import GroupList from "../components/friend/GroupList";
import FriendRequests from "../components/friend/FriendRequests";
import Profile from "../components/modal/ProfileModal"; // Import Profile modal
import AddFriend from "../components/friend/AddFriend"; // Import component AddFriend
import { Search, UserPlus, Users } from "lucide-react";

const Friend = () => {
  const [selectedSection, setSelectedSection] = useState("friends");

  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false); // Thêm state để kiểm soát modal AddFriend
  const [isProfileVisible, setProfileVisible] = useState(false);

  const renderContent = () => {
    switch (selectedSection) {
      case "friends":
        return <FriendsList />;
      case "groups":
        return <GroupList />;
      case "requests":
        return <FriendRequests />;
      default:
        return <FriendsList />;
    }
  };

  return (
    <div className="flex h-screen">
      <NavBar
        setSelectedSection={setSelectedSection}
        setProfileVisible={setProfileVisible}
      />
      {isProfileVisible && (
        <Profile
          isVisible={isProfileVisible}
          onClose={() => setProfileVisible(false)}
        />
      )}
      <div className="w-1/5 bg-gray-200 p-4 flex flex-col justify-start">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm"
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
          className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md"
          onClick={() => setSelectedSection("friends")}
        >
          <Users size={24} className="mr-2" />
          <p className="text-lg">Danh sách bạn bè</p>
        </div>
        <div
          className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md"
          onClick={() => setSelectedSection("groups")}
        >
          <Users size={24} className="mr-2" />
          <p className="text-lg">Danh sách nhóm</p>
        </div>
        <div
          className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md"
          onClick={() => setSelectedSection("requests")}
        >
          <UserPlus size={24} className="mr-2" />
          <p className="text-lg">Lời mời kết bạn</p>
        </div>
      </div>

      <div className="w-4/5 bg-white p-4">{renderContent()}</div>

      <AddFriend
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />
    </div>
  );
};

export default Friend;
