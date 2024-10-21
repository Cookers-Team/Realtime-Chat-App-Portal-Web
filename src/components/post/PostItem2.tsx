import React from 'react';

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
}

const PostItem: React.FC<PostItemProps> = ({ user, content, imageUrl, totalComments, totalReactions, createdAt }) => {
  return (
    <div className="bg-white p-4 mb-4 shadow rounded-lg max-w-2xl mx-auto border-gray-300 border"> 
      <div className="flex items-center mb-2">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt={user.displayName}
          className="w-10 h-10 rounded-full mr-2"
        />
        <div>
          <p className="font-semibold">{user.displayName}</p>
          <p className="text-sm text-gray-500">{createdAt}</p>
        </div>
      </div>
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
