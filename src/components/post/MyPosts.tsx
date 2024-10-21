import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import { useLoading } from '../../hooks/useLoading';
import { remoteUrl } from '../../types/constant';
import { toast } from 'react-toastify';
import InputField from '../InputField';
import { Search, PlusCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Button from '../Button';
import { LoadingDialog } from '../Dialog';
import CreatePost from './CreatePost';
import CreateStory from './CreateStory';
import UpdatePost from './UpdatePost'; 

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createStoryModalVisible, setCreateStoryModalVisible] = useState(false); // State cho Story Modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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

  const handleEdit = (postId: string) => {
    setSelectedPostId(postId);
    setUpdateModalVisible(true); 
  };

  const handleDelete = async (postId: string) => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/post/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        toast.success('Xóa bài viết thành công');
        fetchMyPosts(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa bài viết.');
    } finally {
      hideLoading();
    }
  };

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
              onPress={() => setCreateModalVisible(true)} // Hiển thị popup tạo bài đăng
              className="h-10 flex items-center justify-center"
            />
          </div>
          <div className="w-1/3">
            <Button
              title="Tạo Story"
              color="#FF4500"
              icon={PlusCircle}
              onPress={() => setCreateStoryModalVisible(true)} // Hiển thị popup tạo story
              className="h-10 flex items-center justify-center"
            />
          </div>
          <div className="w-2/3 mt-4">
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
              status={post.status}
              onEdit={() => handleEdit(post._id)} 
              onDelete={() => handleDelete(post._id)} 
            />
          ))
        ) : (
          <p className="text-center">Không có bài viết nào.</p>
        )}
      </div>
      <LoadingDialog isVisible={isLoading} />

      {/* Popup Tạo bài đăng */}
      <CreatePost
        isVisible={createModalVisible}
        setVisible={setCreateModalVisible}
        profile={{ displayName: "User", avatarUrl: "", role: { name: "Người dùng" } }}
        onButtonClick={fetchMyPosts}
      />

      {/* Popup Tạo Story */}
      <CreateStory
        isVisible={createStoryModalVisible}
        setVisible={setCreateStoryModalVisible}
        profile={{ displayName: "User", avatarUrl: "", role: { name: "Người dùng" } }}
        onButtonClick={fetchMyPosts} // Gọi lại hàm tải bài viết sau khi tạo story
      />

      {/* Popup Cập nhật bài đăng */}
      <UpdatePost
        isVisible={updateModalVisible}
        setVisible={setUpdateModalVisible}
        postId={selectedPostId}
        onButtonClick={fetchMyPosts}
      />
    </div>
  );
};

export default MyPosts;
