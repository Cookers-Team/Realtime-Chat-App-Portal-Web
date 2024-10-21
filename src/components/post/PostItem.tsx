import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react'; 

interface PostUser {
  displayName: string;
  avatarUrl: string;
}

interface PostItemProps {
  user: PostUser;
  content: string;
  imageUrl?: string | null;
  totalComments: number;
  totalReactions: number;
  createdAt: string;
  status: number; 
  onEdit: () => void; 
  onDelete: () => void; 
}


const getStatusLabel = (status: number) => {
  switch (status) {
    case 1:
      return "Chờ Duyệt";
    case 2:
      return "Đã Duyệt";
    case 3:
      return "Không Được Duyệt";
    default:
      return "";
  }
};

const PostItem: React.FC<PostItemProps> = ({ user, content, imageUrl, totalComments, totalReactions, createdAt, status, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="bg-white p-4 mb-4 shadow rounded-lg max-w-2xl mx-auto border-gray-300 border">
      <div className="flex items-center mb-2">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt={user.displayName}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div className="flex-grow">
          <p className="font-semibold">{user.displayName}</p>
          <p className="text-sm text-gray-500">{createdAt}</p>
        </div>
        <p className="mr-2 text-sm font-medium text-gray-700">{getStatusLabel(status)}</p> {/* Hiển thị trạng thái */}
        <button onClick={toggleMenu} className="ml-auto">
          <MoreVertical size={20} /> {/* Sử dụng biểu tượng MoreVertical */}
        </button>
      </div>
      {showMenu && (
        <div className="absolute bg-white shadow-lg rounded mt-2 right-0 w-40">
          <button onClick={onEdit} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Chỉnh sửa</button>
          <button onClick={onDelete} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Xóa</button>
        </div>
      )}
      <div>
        <p className="mb-2">{content}</p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-auto rounded-lg mb-2"
            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
          />
        )}
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <p className="mr-4">❤️ {totalReactions}</p>
        <p>💬 {totalComments}</p>
      </div>
    </div>
  );
};

export default PostItem;
