import React, { useState, useEffect } from 'react';
import PostItem2 from './PostItem2';
import StoryItem from './StoryItem'; 
import { useLoading } from '../../hooks/useLoading';
import { remoteUrl } from '../../types/constant';
import { toast } from 'react-toastify';
import InputField from '../InputField';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { LoadingDialog } from '../Dialog';

interface Story {
  _id: string;
  imageUrl: string;
  user: {
    displayName: string;
  };
}

const FriendsPosts = () => {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState<Story[]>([]); // Khai báo kiểu Story cho mảng stories
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0); 
  const [isPopupVisible, setIsPopupVisible] = useState(false); 
  const [activeStoryIndex, setActiveStoryIndex] = useState(0); 

  const storiesPerPage = 5; 
  const autoTransitionTime = 10000; 

  useEffect(() => {
    fetchFriends();
    fetchStories(); 
  }, []);

  useEffect(() => {
    let autoTransition: any;
    if (isPopupVisible) {
      autoTransition = setTimeout(() => {
        handleNextStoryInPopup();
      }, autoTransitionTime); 
    }

    return () => clearTimeout(autoTransition); 
  }, [isPopupVisible, activeStoryIndex]);

  const fetchFriends = async () => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/friendship/list?getListKind=3`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        const friendIds = data.data.content.map((item: any) => item.friend._id);
        setFriends(friendIds);
        fetchFriendsPosts(friendIds);
      } else {
        toast.error('Không thể tải danh sách bạn bè');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải danh sách bạn bè');
    } finally {
      hideLoading();
    }
  };

  const fetchFriendsPosts = async (friendIds: string[]) => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/post/list?kind=2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        const filteredPosts = data.data.content.filter((post: any) =>
          friendIds.includes(post.user._id) && post.status === 2
        );
        setPosts(filteredPosts);
      } else {
        toast.error('Không thể tải bài viết của bạn bè');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải bài viết');
    } finally {
      hideLoading();
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch(`${remoteUrl}/v1/story/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      if (data.result) {
        setStories(data.data.content); 
      } else {
        toast.error('Không thể tải stories');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi tải stories');
    }
  };

  const handleNext = () => {
    if (currentStoryIndex + storiesPerPage < stories.length) {
      setCurrentStoryIndex(currentStoryIndex + storiesPerPage);
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex - storiesPerPage >= 0) {
      setCurrentStoryIndex(currentStoryIndex - storiesPerPage);
    }
  };

  const openPopup = (index: number) => {
    setActiveStoryIndex(index); 
    setIsPopupVisible(true); 
  };

  const closePopup = () => {
    setIsPopupVisible(false); 
  };

  const handleNextStoryInPopup = () => {
    if (activeStoryIndex + 1 < stories.length) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      closePopup(); 
    }
  };

  const handlePrevStoryInPopup = () => {
    if (activeStoryIndex - 1 >= 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
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

        <div className="relative w-full">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <button
              onClick={handlePrev}
              className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
              disabled={currentStoryIndex === 0} 
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <button
              onClick={handleNext}
              className="bg-gray-200 p-2 rounded-full shadow hover:bg-gray-300"
              disabled={currentStoryIndex + storiesPerPage >= stories.length} 
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex justify-center items-center space-x-4 p-4 overflow-hidden">
            {stories.length > 0 ? (
              stories
                .slice(currentStoryIndex, currentStoryIndex + storiesPerPage) 
                .map((story: Story, index: number) => (
                  <div key={story._id} onClick={() => openPopup(index + currentStoryIndex)}>
                    <StoryItem
                      imageUrl={story.imageUrl}
                      userDisplayName={story.user.displayName}
                    />
                  </div>
                ))
            ) : (
              <p>Không có stories.</p>
            )}
          </div>
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
              imageUrl={post.imageUrls}
              totalComments={post.totalComments}
              totalReactions={post.totalReactions}
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <p className="text-center">Không có bài viết nào từ bạn bè.</p>
        )}

        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-full max-w-lg h-full max-h-lg">
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={closePopup}
              >
                &times;
              </button>
              <div className="flex justify-between items-center h-full">
                <button
                  onClick={handlePrevStoryInPopup}
                  className="text-white p-4"
                  disabled={activeStoryIndex === 0}
                >
                  <ChevronLeft size={48} />
                </button>
                <img
                  src={stories[activeStoryIndex]?.imageUrl} 
                  alt={stories[activeStoryIndex]?.user.displayName} 
                  className="max-w-full max-h-full"
                />
                <button
                  onClick={handleNextStoryInPopup}
                  className="text-white p-4"
                  disabled={activeStoryIndex === stories.length - 1}
                >
                  <ChevronRight size={48} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default FriendsPosts;
