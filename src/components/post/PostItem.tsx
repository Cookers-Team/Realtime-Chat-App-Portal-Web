import React, { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { PostModel } from '../../models/post/PostModel';

interface PostItemProps extends PostModel {
  onEdit: () => void;
  onDelete: () => void;
  isPost: number;
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

const PostItem: React.FC<PostItemProps> = ({
  _id,
  user,
  content,
  imageUrls = [],
  totalComments,
  totalReactions,
  createdAt,
  status,
  isOwner,
  onEdit,
  onDelete,
  isPost,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  // Click outside handler to close menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);

  return (
    <div className="bg-white p-4 mb-4 shadow rounded-lg max-w-2xl mx-auto border-gray-300 border relative">
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
        
        {isPost === 1 && isOwner === 1 && (
          <div className="menu-container relative">
            <p className="mr-2 text-sm font-medium text-gray-700">{getStatusLabel(status)}</p>
            <button 
              onClick={toggleMenu}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <MoreVertical size={20} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2">{content}</p>
        {imageUrls.length > 0 && (
          <div className="relative">
            {/* Image Container */}
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
              <img
                src={imageUrls[currentImageIndex]}
                alt={`Post Image ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Image Counter */}
              {imageUrls.length > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {imageUrls.length}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Thumbnail Preview */}
                <div className="flex justify-center mt-2 gap-2">
                  {imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === index 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center text-sm text-gray-500 mt-4">
        <p className="mr-4">❤️ {totalReactions}</p>
        <p>💬 {totalComments}</p>
      </div>
    </div>
  );
};

export default PostItem;