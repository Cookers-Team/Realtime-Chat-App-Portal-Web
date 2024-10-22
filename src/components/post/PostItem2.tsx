import React from 'react';

interface PostUser {
  displayName: string;
  avatarUrl: string;
}

interface PostItemProps {
  user: PostUser;
  content: string;
  imageUrls?: string[]; // Chuyển từ string | null thành mảng string
  totalComments: number;
  totalReactions: number;
  createdAt: string;
}

const PostItem: React.FC<PostItemProps> = ({
  user,
  content,
  imageUrls = [], 
  totalComments,
  totalReactions,
  createdAt
}) => {
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
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-2"> 
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post Image ${index + 1}`}
                className="w-full h-auto rounded-lg mb-2"
                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
              />
            ))}
          </div>
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
