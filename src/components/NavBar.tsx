import React from 'react';
import { Search, MessageCircle, FileText, Users, Settings, User } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ setSelectedSection }: { setSelectedSection: (section: string) => void }) => {
  const navigate = useNavigate(); 

  return (
    <div className="w-16 bg-blue-500 text-white flex flex-col items-center py-6 space-y-6">
      <button
        data-tooltip-id="tooltip-profile"
        data-tooltip-content="Trang cá nhân"
        className="focus:outline-none"
        onClick={() => navigate('/profile')} 
      >
        <User size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-messages"
        data-tooltip-content="Tin nhắn"
        onClick={() => setSelectedSection('messages')}
        className="focus:outline-none"
      >
        <MessageCircle size={24} className="hover:scale-110 transition-transform" />
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
        data-tooltip-content="cài đặt"
        onClick={() => setSelectedSection('settings')}
        className="focus:outline-none"
      >
        <Settings size={24} className="hover:scale-110 transition-transform" />
      </button>

      <Tooltip id="tooltip-profile" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-messages" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-posts" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-friends" style={{ zIndex: 100 }} />
      <Tooltip id="tooltip-settings" style={{ zIndex: 100 }} />

    </div>
  );
};

export default NavBar;
