import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import ModalProfile from "../components/modal/ModalProfile";
import ModalUpdate from "../components/modal/ModalUpdate";
import { useLoading } from "../hooks/useLoading";
import { remoteUrl } from "../types/constant";
import { toast } from "react-toastify";
import { LoadingDialog } from "../components/Dialog";
import { Profile } from "../models/profile/Profile";
import { Search, MessageCircle, FileText, Users, Settings, User } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Home2 = () => {
  const navigate = useNavigate();
  const { isLoading, showLoading, hideLoading } = useLoading();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileUpdate, setProfileUpdate] = useState<Profile | null>(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(''); // Quản lý phần hiển thị

  const showProfile = async () => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      const result = await response.json();
      const currentProfile: Profile = result.data;
      setProfile(currentProfile);
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      hideLoading();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeUpdate = () => {
    setIsModalUpdateOpen(false);
  };

  const showUpdate = () => {
    setIsModalUpdateOpen(true);
  };

  // Điều hướng đến trang bạn bè
  const navigateToFriends = () => {
    navigate('/friends'); // Điều hướng đến trang /friends khi nhấn vào nút Friends
  };

  return (
    <div className="flex h-screen">
      {/* Phần 1: Thanh điều hướng bên trái chỉ có icon */}
      <div className="w-16 bg-blue-500 text-white flex flex-col items-center py-6 space-y-6">
        <button data-tooltip-id="tooltip-profile" data-tooltip-content="Profile" onClick={showProfile} className="focus:outline-none">
          <User size={24} className="hover:scale-110 transition-transform" />
        </button>

        <button data-tooltip-id="tooltip-messages" data-tooltip-content="Messages" onClick={() => setSelectedSection('messages')} className="focus:outline-none">
          <MessageCircle size={24} className="hover:scale-110 transition-transform" />
        </button>

        <button data-tooltip-id="tooltip-posts" data-tooltip-content="Posts" onClick={() => setSelectedSection('posts')} className="focus:outline-none">
          <FileText size={24} className="hover:scale-110 transition-transform" />
        </button>

        <button data-tooltip-id="tooltip-friends" data-tooltip-content="Friends" onClick={navigateToFriends} className="focus:outline-none">
          <Users size={24} className="hover:scale-110 transition-transform" />
        </button>

        <button data-tooltip-id="tooltip-settings" data-tooltip-content="Settings" onClick={() => setSelectedSection('settings')} className="focus:outline-none">
          <Settings size={24} className="hover:scale-110 transition-transform" />
        </button>

        {/* Các tooltip tương ứng với các icon */}
        <Tooltip id="tooltip-profile" />
        <Tooltip id="tooltip-messages" />
        <Tooltip id="tooltip-posts" />
        <Tooltip id="tooltip-friends" />
        <Tooltip id="tooltip-settings" />
      </div>

      {/* Phần 2: Khu vực tìm kiếm */}
      <div className="w-1/5 bg-gray-200 p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="pl-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-gray-600">Dùng ô tìm kiếm để tìm tin nhắn, bạn bè, bài đăng...</p>
      </div>

      {/* Phần 3: Khu vực hiển thị nội dung */}
      <div className="w-4/5 bg-white p-4">
        {selectedSection === 'messages' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Tin nhắn</h2>
            <p>Hiển thị nội dung tin nhắn tại đây...</p>
          </div>
        )}
        {selectedSection === 'posts' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Bài đăng</h2>
            <p>Hiển thị nội dung bài đăng tại đây...</p>
          </div>
        )}
        {selectedSection === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cài đặt</h2>
            <p>Hiển thị các cài đặt tại đây...</p>
          </div>
        )}
        {selectedSection === '' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Chọn một mục từ thanh điều hướng</h2>
          </div>
        )}
      </div>

      {/* Modal hiển thị profile và cập nhật */}
      {profile && <ModalProfile isOpen={isModalOpen} profile={profile} onClose={closeModal} onUpdate={showUpdate} />}
      {profile && <ModalUpdate isOpen={isModalUpdateOpen} profile={profile} onClose={closeUpdate} onUpdate={() => {}} />}
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default Home2;
