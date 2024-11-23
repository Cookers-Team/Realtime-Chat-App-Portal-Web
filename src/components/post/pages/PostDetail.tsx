import React, { useState } from 'react';
import { XCircle, Heart, MessageCircle, Share2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Profile } from '../../../models/profile/Profile';
import CommentsSection from '../comment/CommentsSection';


const PostDetail= ({
  postItem,
  onClose
}: any) => {
  console.log("Thông tin post chi tiết:", postItem._id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-lg my-4">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white z-10">
          <h2 className="text-xl font-semibold">Bài viết của {postItem.user.displayName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {/* Author Info */}
          <div className="flex items-center mb-4">
            <img 
              src={postItem.user.avatarUrl} 
              alt={postItem.user.displayName} 
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <p className="font-semibold">{postItem.user.displayName}</p>
              <p className="text-sm text-gray-500">1 giờ trước</p>
            </div>
            <button className="ml-auto text-gray-500">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Post Content */}
          <p className="mb-4">{postItem.postContent}</p>
          
          {/* Images */}
          {postItem.imageUrls.length > 0 && (
            <div className="relative">
              <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
                <img
                  src={postItem.imageUrls[currentImageIndex]}
                  alt={`Post Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                {postItem.imageUrls.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {postItem.imageUrls.length}
                  </div>
                )}
              </div>
              {postItem.imageUrls.length > 1 && (
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
                </>
              )}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex justify-between items-center py-2 border-y text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              {postItem.totalReactions > 0 && (
                <span className="flex items-center gap-1">
                  <div className="bg-blue-500 p-1 rounded-full">
                    <Heart size={12} className="text-white" />
                  </div>
                  {postItem.totalReactions}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <span>{postItem.totalComments} bình luận</span>
              <h2>{postItem.postId}</h2>
            </div>
          </div>

          {/* Comments Section */}
          <CommentsSection postId={postItem._id} totalComments={postItem.totalComments} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;