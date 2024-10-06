import React from "react";
import { MessageCircle, FileText, Users, Settings, User, LogOut } from "lucide-react"; // Thêm LogOut
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  setSelectedSection: (section: string) => void;
  setProfileVisible: (visible: boolean) => void; // Truyền setProfileVisible từ component cha
}

const NavBar: React.FC<NavBarProps> = ({
  setSelectedSection,
  setProfileVisible,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem('accessToken'); 
    navigate('/'); 
  };

  return (
    <div className="w-16 bg-blue-500 text-white flex flex-col items-center py-6 space-y-6">
     
      <button
        data-tooltip-id="tooltip-profile"
        data-tooltip-content="Trang cá nhân"
        className="focus:outline-none"
        onClick={() => setProfileVisible(true)} 
      >
        <User size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-messages"
        data-tooltip-content="Tin nhắn"
        onClick={() => setSelectedSection('messages')}
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
        onClick={() => navigate('/postPage')}
        className="focus:outline-none"
      >
        <FileText size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-friends"
        data-tooltip-content="Bạn bè"
        onClick={() => navigate('/friends')}
        className="focus:outline-none"
      >
        <Users size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-settings"
        data-tooltip-content="Cài đặt"
        onClick={() => setSelectedSection('settings')}
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
