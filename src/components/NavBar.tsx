import React, { useState } from "react";
import {
  MessageCircle,
  FileText,
  Users,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router-dom";
import { ConfimationDialog } from "./Dialog";
import useDialog from "../hooks/useDialog";
import ProfileModal from "../components/modal/ProfileModal";
import EditProfileModal from "../components/modal/EditProfileModal";

interface NavBarProps {
  setSelectedSection: (section: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setSelectedSection }) => {
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const navigate = useNavigate();
  const { isDialogVisible, showDialog, hideDialog } = useDialog();

  const handleProfileClick = () => {
    setProfileModalVisible(true);
  };

  const handleOpenEditModal = () => {
    setProfileModalVisible(false);
    setEditProfileModalVisible(true);
  };

  const handleLogout = () => {
    showDialog();
  };

  const onConfirmLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
    window.location.reload();
  };

  const onCancelLogout = () => {
    hideDialog();
  };

  return (
    <div className="w-16 bg-blue-500 text-white flex flex-col items-center py-6 space-y-6">
      <button
        data-tooltip-id="tooltip-profile"
        data-tooltip-content="Trang cá nhân"
        className="focus:outline-none"
        onClick={handleProfileClick}
      >
        <User size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-messages"
        data-tooltip-content="Tin nhắn"
        onClick={() => setSelectedSection("messages")}
        className="focus:outline-none"
      >
        <MessageCircle
          size={24}
          className="hover:scale-110 transition-transform"
        />
      </button>

      <button
        data-tooltip-id="tooltip-posts"
        data-tooltip-content="Bài đăng"
        onClick={() => setSelectedSection("posts")}
        className="focus:outline-none"
      >
        <FileText size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-friends"
        data-tooltip-content="Bạn bè"
        onClick={() => setSelectedSection("friends")}
        className="focus:outline-none"
      >
        <Users size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-settings"
        data-tooltip-content="Cài đặt"
        onClick={() => setSelectedSection("settings")}
        className="focus:outline-none"
      >
        <Settings size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-logout"
        data-tooltip-content="Đăng xuất"
        className="focus:outline-none mt-auto"
        onClick={handleLogout}
      >
        <LogOut size={24} className="hover:scale-110 transition-transform" />
      </button>

      {profileModalVisible && (
        <ProfileModal
          isVisible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          onOpenEditModal={handleOpenEditModal}
        />
      )}

      {editProfileModalVisible && (
        <EditProfileModal
          isVisible={editProfileModalVisible}
          onClose={() => setEditProfileModalVisible(false)}
          onOpenProfileModal={() => setProfileModalVisible(true)}
        />
      )}

      <ConfimationDialog
        isVisible={isDialogVisible}
        title="Xác nhận"
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={onConfirmLogout}
        onCancel={onCancelLogout}
        confirmText="Đăng xuất"
        color="red"
      />

      <Tooltip id="tooltip-profile" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-messages" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-posts" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-friends" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-settings" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-logout" style={{ zIndex: 100 }} />
    </div>
  );
};

export default NavBar;
