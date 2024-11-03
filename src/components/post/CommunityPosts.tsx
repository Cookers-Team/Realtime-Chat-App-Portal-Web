import React, { useEffect, useState } from 'react';
import InputField from '../InputField';
import { Search } from 'lucide-react';
import PostItem from './PostItem';
import { LoadingDialog } from '../Dialog';
import { useLoading } from '../../hooks/useLoading';
import { remoteUrl } from '../../types/constant';
import { toast } from 'react-toastify';
import PostItem2 from './PostItem2';

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, showLoading, hideLoading } = useLoading();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/post/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        setPosts(data.data.content);
      } else {
        toast.error('Không thể tải bài viết');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi');
    } finally {
      hideLoading();
    }
  };

  const filteredPosts = posts.filter((post: any) =>
    post.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
    
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <h1 className="text-xl font-bold text-center py-2 m-0">Bài viết của bạn bè</h1>
      </div>

    
      <div className="flex-grow overflow-y-auto p-4">
     
        <div className="max-w-2xl mx-auto mb-6">
          <InputField
            placeholder="Tìm kiếm bài viết theo tên"
            icon={Search}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

   
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: any) => (
            <PostItem2
              key={post._id}
              user={{
                displayName: post.user.displayName,
                avatarUrl: post.user.avatarUrl,
              }}
              content={post.content}
              imageUrls={post.imageUrls}
              totalComments={post.totalComments}
              totalReactions={post.totalReactions}
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <p className="text-center">Không có bài viết nào.</p>
        )}
      </div>
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default CommunityPosts;
