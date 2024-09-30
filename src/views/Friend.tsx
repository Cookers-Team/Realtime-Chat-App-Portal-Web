import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import FriendsList from '../components/friend/FriendsList';
import GroupList from '../components/friend/GroupList';
import FriendRequests from '../components/friend/FriendRequests';
import { Search, UserPlus, Users } from 'lucide-react'; // Thêm Users vào import

const Friend = () => {
  const [selectedSection, setSelectedSection] = useState('friends');

  const renderContent = () => {
    switch (selectedSection) {
      case 'friends':
        return <FriendsList />;
      case 'groups':
        return <GroupList />;
      case 'requests':
        return <FriendRequests />;
      default:
        return <FriendsList />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Phần 1: Thanh điều hướng */}
      <NavBar setSelectedSection={setSelectedSection} />

      {/* Phần 2: Danh mục các phần */}
      <div className="w-1/5 bg-gray-200 p-4 flex flex-col justify-start">
        {/* Tìm kiếm và nút thêm bạn bè */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="pl-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
            <UserPlus size={24} />
          </div>
        </div>

        {/* Danh sách các phần */}
        <div className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md" onClick={() => setSelectedSection('friends')}>
          <Users size={24} className="mr-2" />
          <p className="text-lg">Danh sách bạn bè</p>
        </div>
        <div className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md" onClick={() => setSelectedSection('groups')}>
          <Users size={24} className="mr-2" />
          <p className="text-lg">Danh sách nhóm</p>
        </div>
        <div className="mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md" onClick={() => setSelectedSection('requests')}>
          <UserPlus size={24} className="mr-2" />
          <p className="text-lg">Lời mời kết bạn</p>
        </div>
      </div>

      {/* Phần 3: Hiển thị nội dung tương ứng */}
      <div className="w-4/5 bg-white p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Friend;
