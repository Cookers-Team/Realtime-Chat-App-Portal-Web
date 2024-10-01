import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import { useLoading } from '../../hooks/useLoading';
import { remoteUrl } from '../../types/constant';
import { toast } from 'react-toastify';
import InputField from '../InputField';
import { Search, PlusCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Button from '../Button';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { showLoading, hideLoading } = useLoading();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.userId;
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return null;
    }
  };

  const userId = getUserIdFromToken();

  const fetchMyPosts = async () => {
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
        const userPosts = data.data.content.filter((post: any) => post.user._id === userId);
        setPosts(userPosts);
      } else {
        toast.error('Không thể tải bài viết của bạn.');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải bài viết.');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyPosts();
    } else {
      toast.error('Không tìm thấy ID người dùng.');
    }
  }, [userId]);

  const filteredPosts = posts.filter((post: any) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 bg-white z-10 shadow-sm">
        <h1 className="text-xl font-bold text-center py-2 m-0">Bài đăng của tôi</h1>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto mb-6 flex gap-2 items-center">
          <div className="w-1/3">
            <Button
              title="Tạo bài đăng"
              color="#1877F2"
              icon={PlusCircle}
              onPress={() => {
                console.log('Create post clicked');
              }}
              className="h-10 flex items-center justify-center"  
            />
          </div>
          <div className="w-2/3 mt-4"> {/* Thêm mt-2 để dịch ô tìm kiếm xuống */}
            <InputField
              placeholder="Tìm kiếm"
              icon={Search}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>



        {filteredPosts.length > 0 ? (
          filteredPosts.map((post: any) => (
            <PostItem
              key={post._id}
              user={{
                displayName: post.user.displayName,
                avatarUrl: post.user.avatarUrl,
              }}
              content={post.content}
              imageUrl={post.imageUrl}
              totalComments={post.totalComments}
              totalReactions={post.totalReactions}
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <p className="text-center">Không có bài viết nào.</p>
        )}
      </div>
    </div>
  );
};

export default MyPosts;