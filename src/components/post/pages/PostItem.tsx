import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MoreHorizontal,
  MessageCircle,
} from "lucide-react";
import { PostModel } from "../../../models/post/PostModel";
import PostDetail from "./PostDetail";

const PostItem = ({ postItem, onEdit, onDelete } :  
  { postItem: PostModel;
    onEdit: () => void;
    onDelete: () => void;
  }
) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === postItem.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? postItem.imageUrls.length - 1 : prev - 1
    );
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMenu && !(event.target as Element).closest(".menu-container")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  const handleShowModal = () => {
    console.log("Post Item khi mở modal:", postItem);
  setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
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

  return (
    <div className="bg-white rounded-lg shadow mb-4">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={postItem.user.avatarUrl || "/default-avatar.png"}
              alt={postItem.user.displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">{postItem.user.displayName}</p>
              <div className="text-gray-500 text-sm flex items-center space-x-2">
                <span>{new Date(postItem.createdAt).toLocaleString()}</span>
                {postItem.isOwner === 1 && (
                  <span>• {getStatusLabel(postItem.status)}</span>
                )}
              </div>
            </div>
          </div>
          {postItem.isOwner === 1 && (
            <div className="menu-container relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreHorizontal size={20} className="text-gray-600" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <button
                    onClick={onEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Chỉnh sửa bài viết
                  </button>
                  <button
                    onClick={onDelete}
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
          <p className="text-sm">{postItem.content}</p>
        </div>
      </button>
      </div>



      {/* Image Slider */}
      <div onClick={handleShowModal} className="block w-full text-left">
      {postItem.imageUrls.length > 0 && (
        <div className="relative w-full h-[400px]">
          <img
            src={postItem.imageUrls[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          {postItem.imageUrls.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
</div>
      {/* Engagement Section */}
      <div className="p-4 border-t border-gray-200 flex justify-between">
        <button className="flex items-center space-x-2 text-gray-600">
          <Heart size={20} />
          <span>{postItem.totalReactions}</span>
        </button>
        <button className="flex items-center space-x-2 text-gray-600">
          <MessageCircle size={20} />
          <span>{postItem.totalComments} bình luận</span>
        </button>
      </div>

      {showModal && (
        <PostDetail
          postItem = {postItem}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PostItem;
