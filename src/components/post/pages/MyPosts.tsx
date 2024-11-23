import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostItem from './PostItem';
import { useLoading } from '../../../hooks/useLoading';
import { remoteUrl } from '../../../types/constant';
import { toast } from 'react-toastify';
import InputField from '../../InputField';
import { Search, PlusCircle, Loader2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Button from '../../Button';
import { LoadingDialog } from '../../Dialog';
import CreatePost from './CreatePost';
import CreateStory from '../story/CreateStory';
import UpdatePost from './UpdatePost';
import { PostModel } from '../../../models/post/PostModel';
import useFetch from '../../../hooks/useFetch';

const MyPosts = () => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createStoryModalVisible, setCreateStoryModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostModel | null>(null);
  const {get} = useFetch();
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const itemsPerPage = 10;

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
  
  const fetchMyPosts = async (pageNumber: number) => {
    try {
      const response = await get(`/v1/post/list`, {
        page: pageNumber,
        size: itemsPerPage,
        getListKind: 3,
      });
    
      const data = response.data.content;
   
      if (pageNumber === 0) {
        setPosts(data);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
  
      setHasMore(data.length > 0);
    } catch (error: any) {
      console.error("Lỗi chi tiết:", error); 
      
    } finally {
      setIsLoadingMore(false);
    }
  };
  

  // Intersection Observer setup
  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (isLoading || isLoadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !searchQuery) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore, searchQuery]);

  useEffect(() => {
  
      fetchMyPosts(0);
    }
  );

  useEffect(() => {
    if (page > 0 && hasMore && !searchQuery) {
      fetchMyPosts(page);
    }
  }, [page]);


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
        // Reset pagination and fetch posts again
        setPage(0);
        fetchMyPosts(0);
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

  // Reset pagination when searching
  useEffect(() => {
    if (searchQuery) {
      setPage(0);
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [searchQuery]);

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
              onPress={() => setCreateModalVisible(true)}
              className="h-10 flex items-center justify-center"
            />
          </div>
          <div className="w-1/3">
            <Button
              title="Tạo Story"
              color="#FF4500"
              icon={PlusCircle}
              onPress={() => setCreateStoryModalVisible(true)}
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
          filteredPosts.map((post: any, index: number) => (
            <div
              key={post._id}
              ref={index === filteredPosts.length - 1 ? lastPostRef : null}
            >
              <PostItem
                postItem = {post}
                onEdit={() => handleEdit(post._id)}
                onDelete={() => handleDelete(post._id)}
         
              />
            </div>
          ))
        ) : (
          <p className="text-center">Không có bài viết nào.</p>
        )}

{isLoadingMore && (
  <div className="flex justify-center items-center py-4 h-16">
    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
  </div>
)}

      </div>

      <LoadingDialog isVisible={isLoading} />

      <CreatePost
        isVisible={createModalVisible}
        setVisible={setCreateModalVisible}
        profile={{ displayName: "User", avatarUrl: "", role: { name: "Người dùng" } }}
        onButtonClick={() => {
          setPage(0);
          fetchMyPosts(0);
        }}
      />

      <CreateStory
        isVisible={createStoryModalVisible}
        setVisible={setCreateStoryModalVisible}
        profile={{ displayName: "User", avatarUrl: "", role: { name: "Người dùng" } }}
        onButtonClick={() => {
          setPage(0);
          fetchMyPosts(0);
        }}
      />

      <UpdatePost
        isVisible={updateModalVisible}
        setVisible={setUpdateModalVisible}
        postId={selectedPostId}
        onButtonClick={() => {
          setPage(0);
          fetchMyPosts(0);
        }}
      />
    </div>
  );
};


export default MyPosts;