import React, { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight,ThumbsUp, MoreHorizontal, MessageCircle,Share2  } from 'lucide-react';
import { PostModel } from '../../models/post/PostModel';
import PostDetail from './PostDetail';

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
  const [showModal, setShowModal] = useState(false);

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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">{user.displayName}</p>
              <div className="flex items-center space-x-2 text-gray-500 text-sm">
                <span>{createdAt}</span>
                {isPost === 1 && (
                  <span>• {getStatusLabel(status)}</span>
                )}
              </div>
            </div>
          </div>

          {isPost === 1 && isOwner === 1 && (
            <div className="menu-container relative">
              <button 
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Chỉnh sửa bài viết
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Xóa bài viết
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <button onClick={handleShowModal} className="block w-full text-left">
        <div className="mt-3">
          <p className="text-sm">{content}</p>
        </div>
        </button>
      </div>

      <div onClick={handleShowModal} className="block w-full text-left">
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
      {/* Engagement stats */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="bg-blue-500 rounded-full p-1">
              <ThumbsUp size={12} className="text-white" />
            </div>
            <span>{totalReactions}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{totalComments} bình luận</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-gray-200">
        <div className="flex items-center justify-between px-4 py-2">
          <button className="flex items-center justify-center space-x-2 py-2 px-4 hover:bg-gray-100 rounded-lg flex-1">
            <ThumbsUp size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Thích</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-2 px-4 hover:bg-gray-100 rounded-lg flex-1">
            <MessageCircle size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Bình luận</span>
          </button>
          <button className="flex items-center justify-center space-x-2 py-2 px-4 hover:bg-gray-100 rounded-lg flex-1">
            <Share2 size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Chia sẻ</span>
          </button>
        </div>
      </div>

      {showModal && (
        <PostDetail
          postId={_id}
          postContent={content}
          imageUrls={imageUrls}
          totalComments={totalComments} // Pass totalComments here
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
};

export default PostItem;