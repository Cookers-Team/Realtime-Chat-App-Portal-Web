import React from "react";
import { MessageCircle, FileText, Users, Settings, User } from "lucide-react";
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

  return (
    <div className="w-16 bg-blue-500 text-white flex flex-col items-center py-6 space-y-6">
      {/* Nút mở Profile */}
      <button
        data-tooltip-id="tooltip-profile"
        data-tooltip-content="Profile"
        className="focus:outline-none"
        onClick={() => setProfileVisible(true)} // Mở modal Profile
      >
        <User size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-messages"
        data-tooltip-content="Messages"
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
        data-tooltip-content="Posts"
        onClick={() => setSelectedSection("posts")}
        className="focus:outline-none"
      >
        <FileText size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-friends"
        data-tooltip-content="Friends"
        onClick={() => navigate("/friends")}
        className="focus:outline-none"
      >
        <Users size={24} className="hover:scale-110 transition-transform" />
      </button>

      <button
        data-tooltip-id="tooltip-settings"
        data-tooltip-content="Settings"
        onClick={() => setSelectedSection("settings")}
        className="focus:outline-none"
      >
        <Settings size={24} className="hover:scale-110 transition-transform" />
      </button>

      {/* Các tooltip tương ứng với các icon */}
      <Tooltip id="tooltip-profile" />
      <Tooltip id="tooltip-messages" />
      <Tooltip id="tooltip-posts" />
      <Tooltip id="tooltip-friends" />
      <Tooltip id="tooltip-settings" />
    </div>
  );
};

export default NavBar;
