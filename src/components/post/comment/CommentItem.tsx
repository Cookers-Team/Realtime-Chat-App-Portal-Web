// CommentItem.tsx
import React from 'react';
import { CommentModel } from '../../../models/comment/CommentModel';

interface CommentItemProps {
  comment: CommentModel;
  isChild?: boolean;
  children?: React.ReactNode; 
}


const CommentItem: React.FC<CommentItemProps> = ({ comment, isChild = false, children }) => (
  <div className={`flex gap-2 ${isChild ? 'ml-8' : ''}`}>
  <img
    src={comment.user.avatarUrl || '/default-avatar.png'}
    alt={comment.user.displayName}
    className="w-8 h-8 rounded-full"
  />
  <div className="flex-1">
    <div className="bg-gray-100 rounded-2xl px-4 py-2 inline-block">
      <p className="font-semibold">{comment.user.displayName}</p>
      <p>{comment.content}</p>
    </div>
    <div className="flex gap-4 mt-1 text-sm">
      <button className="font-semibold hover:underline text-gray-500">Thích</button>
      <button className="font-semibold hover:underline text-gray-500">Phản hồi</button>
      <span className="text-gray-500">{comment.createdAt}</span>
    </div>
    {children && <div className="mt-2">{children}</div>}
  </div>
</div>

);

export default CommentItem;
