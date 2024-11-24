import React, { useState } from 'react';
import { CommentModel } from '../../../models/comment/CommentModel';
import ChildComments from './ChildComments';
import useFetch from '../../../hooks/useFetch';
import { remoteUrl } from '../../../types/constant';
import { uploadImage } from '../../../types/utils';

const CommentItem = ({
  comment,
  isChild = false,
  childComments,
  isLoading,
  onLoadMore,
}: {
  comment: CommentModel;
  isChild?: boolean;
  childComments?: CommentModel[];
  isLoading?: boolean;
  onLoadMore?: (
    parentId: string,
    page: number
  ) => Promise<{ hasMore: boolean; totalRemaining: number }>;
}) => {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState('');
  const [selectedReplyImage, setSelectedReplyImage] = useState<File | null>(null);
  const { get, post } = useFetch();
  const [comment1, setComment] = useState<CommentModel>(comment);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  
  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
  
    if (!newReply.trim() && !selectedReplyImage) {
      alert('Phản hồi phải có nội dung hoặc hình ảnh!');
      return;
    }
  
    try {
      const imageUrl = selectedReplyImage ? await uploadImage(selectedReplyImage, post) : '';
      const response = await fetch(`${remoteUrl}/v1/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          post: comment.post._id,
          content: newReply.trim(),
          parent: parentId,
          imageUrl,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Không thể gửi phản hồi!');
      }
  
      const data = await response.json();
      console.log('Phản hồi đã gửi thành công:', data);
  
      // Reset trạng thái sau khi gửi thành công
      setNewReply('');
      setSelectedReplyImage(null);
      setReplyTo(null);
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      alert('Đã xảy ra lỗi khi gửi phản hồi. Vui lòng thử lại.');
    }
  };
  

  const handleImageSelect = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn tệp hình ảnh!');
        return;
      }
      setSelectedReplyImage(file);
    }
  };
  
  const handleLike = async (commentId: string) => {
    if (isLiking) return; // Ngăn chặn nhiều lần nhấn khi đang loading
    setIsLiking(true); // Bắt đầu loading

    try {
      if (!isLiked) {
        // Gọi API để thêm thích
        const response = await fetch(`${remoteUrl}/v1/comment-reaction/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ comment: commentId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Không thể thích bình luận!');
        }

        // Cập nhật giao diện sau khi thích
        setComment((prev) => ({
          ...prev,
          totalReactions: prev.totalReactions + 1,
        }));
        setIsLiked(true); // Đánh dấu đã thích
        console.log('Thích thành công');
      } else {
        // Gọi API để bỏ thích
        const response = await fetch(`${remoteUrl}/v1/comment-reaction/delete/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.message || 'Không thể bỏ thích bình luận!');
        }

        // Cập nhật giao diện sau khi bỏ thích
        setComment((prev) => ({
          ...prev,
          totalReactions: Math.max(prev.totalReactions - 1, 0),
        }));
        setIsLiked(false); // Đánh dấu chưa thích
        console.log('Bỏ thích thành công');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý thích:', error);
      alert('Đã xảy ra lỗi, vui lòng thử lại.');
    } finally {
      setIsLiking(false); // Kết thúc loading
    }
  };
  
  const removeReplyImage = () => {
    setSelectedReplyImage(null); // Xóa ảnh đã chọn
  };
  const toggleMenu = () => setMenuVisible((prev) => !prev);

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    try {
      const response = await fetch(`${remoteUrl}/v1/comment/delete/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Không thể xóa bình luận!');
      }

      alert('Xóa bình luận thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa bình luận:', error);
      alert('Đã xảy ra lỗi khi xóa bình luận. Vui lòng thử lại.');
    }
  };

  const handleEdit = () => {
    // Logic xử lý chỉnh sửa (hiển thị form hoặc điều hướng)
    alert('Chức năng chỉnh sửa đang được phát triển!');
  };

  return (
    <div className={`flex gap-2 ${isChild ? 'ml-8' : ''}`}>
      {/* User Avatar */}
      <img
        src={comment.user.avatarUrl || '/default-avatar.png'}
        alt={comment.user.displayName}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1 relative">
        {/* Comment Content */}
        <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block">
          <p className="font-semibold">{comment.user.displayName}</p>
          <p>{comment.content}</p>
          {comment.imageUrl && (
            <img
              src={comment.imageUrl}
              alt="Comment Attachment"
              className="mt-2 rounded-lg max-w-full"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-1 text-sm items-center">
          {/* Like Button */}
          <button
            className="font-semibold hover:underline text-gray-500 flex items-center gap-2"
            disabled={isLiking}
            onClick={() => handleLike(comment._id)}
          >
            {isLiking ? (
              <span className="text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v4m0 0v4m0-4h4m-4 0H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            ) : isLiked ? 'Bỏ thích' : 'Thích'}
          </button>

          {/* Hiển thị trái tim nếu có like */}
          {comment1.totalReactions > 0 && (
            <div className="flex items-center gap-1 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span>{comment1.totalReactions}</span>
            </div>
          )}

          {!isChild && (
            <button
              className="font-semibold hover:underline text-gray-500"
              onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
            >
              Phản hồi
            </button>
          )}
          <span className="text-gray-500">{comment.createdAt}</span>
        </div>
        {comment.isOwner === 1 && (
        <div className="absolute right-2 top-2">
      <button
        onClick={toggleMenu}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 12C6 13.1046 5.10457 14 4 14C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10C5.10457 10 6 10.8954 6 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12ZM20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z" />
        </svg>
      </button>

      {menuVisible && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <button
            onClick={handleEdit}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Chỉnh sửa
          </button>
          <button
            onClick={() => handleDelete(comment._id)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Xóa bình luận
          </button>
        </div>
      )}
      
      </div>
        )}
        {/* Render Child Comments */}
        {!isChild && onLoadMore && (
          <ChildComments
            parentId={comment._id}
            childComments={childComments || []}
            isLoading={isLoading || false}
            onLoadMore={onLoadMore}
            totalChildren={comment.totalChildren}
          />
        )}

        {/* Reply Box (Hiển thị dưới Child Comments) */}
        {!isChild && replyTo === comment._id && (
          <form
            onSubmit={(e) => handleReplySubmit(e, comment._id)}
            className="mt-2 flex flex-col gap-2 ml-8"
          >
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Viết phản hồi..."
              className="w-full px-4 py-2 bg-gray-100 rounded-lg resize-none"
              rows={3}
            />
            <div className="flex items-center gap-2">
              {/* Image Upload */}
              <label
                htmlFor={`reply-image-${comment._id}`}
                className="flex items-center gap-2 cursor-pointer text-blue-500 hover:underline"
              >
                <img src="/icons/image-upload-icon.svg" alt="Upload" className="w-6 h-6" />
                <span>Thêm hình ảnh</span>
              </label>
              <input
                id={`reply-image-${comment._id}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSelect(e.target.files)}
              />
            </div>
            {/* Image Preview */}
            {selectedReplyImage && (
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedReplyImage)}
                  alt="Preview"
                  className="mt-2 rounded-lg max-w-full"
                />
                <button
                  onClick={removeReplyImage}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  X
                </button>
              </div>
            )}
            <button
              type="submit"
              className="self-end px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Gửi phản hồi
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentItem;