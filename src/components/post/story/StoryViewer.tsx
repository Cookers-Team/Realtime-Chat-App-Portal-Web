import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Trash2 } from 'lucide-react';
import { StoryModel } from '../../../models/story/StoryModel';
import { remoteUrl } from '../../../types/constant';
import { toast } from 'react-toastify';
import { useLoading } from '../../../hooks/useLoading';
import { LoadingDialog } from '../../Dialog';

const StoryViewer = () => {
  const [stories, setStories] = useState<StoryModel[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentStory, setCurrentStory] = useState<StoryModel | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoading();
  
  const storiesPerPage = 4;
  const autoTransitionTime = 5000;

  useEffect(() => {
    fetchInitialStories();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPopupVisible && !isPaused && currentStory) {
      timer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (autoTransitionTime / 100));
          if (newProgress >= 100) {
            handleNextStory(); 
            return 0; 
          }
          return newProgress;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPopupVisible, currentStory?._id, isPaused]);
  

  const fetchInitialStories = async () => {
    try {
      const response = await fetch(`${remoteUrl}/v1/story/list`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      const data = await response.json();
      if (data.result) {
        setStories(data.data.content);
      }
    } catch (error) {
      toast.error('Không thể tải stories');
    }
  };

  const deleteStory = async (storyId: string) => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/story/delete/${storyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      const data = await response.json();
      if (data.result) {
        toast.success('Xóa story thành công');
        handleNextStory();
        fetchInitialStories();
      } else {
        toast.error('Không thể xóa story');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi xóa story');
    }finally {
      hideLoading();
    }
  };

  const fetchStoryById = async (storyId: string) => {
    try {
      const response = await fetch(`${remoteUrl}/v1/story/get/${storyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        }
      });
      const data = await response.json();
      if (data.result) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching story:', error);
      return null;
    }
  };
  const handleDeleteClick = () => {
    setIsPaused(true); // Tạm dừng story khi hiển thị dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (currentStory) {
      await deleteStory(currentStory._id);
      setShowConfirmDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setIsPaused(false); // Tiếp tục story khi đóng dialog
  };
  const openStoryViewer = async (story: StoryModel) => {
    const fullStory = await fetchStoryById(story._id);
    if (fullStory) {
      setCurrentStory(fullStory);
      setIsPopupVisible(true);
      setProgress(0);
      setIsPaused(false);
    }
  };

  const handleNextStory = async () => {
    setIsTransitioning(true); 
  
    if (!currentStory?.nextStory) {
      setIsPopupVisible(false);
      setIsTransitioning(false);
      return;
    }
  
    const nextStory = await fetchStoryById(currentStory.nextStory);
    if (nextStory) {
      setCurrentStory(nextStory);
      setIsPaused(false);
      setProgress(0);
      setIsTransitioning(false);
    }
  };
  
  const handlePrevStory = async () => {
    if (!currentStory?.previousStory) {
      return;
    }
  
    const prevStory = await fetchStoryById(currentStory.previousStory);
    if (prevStory) {
      setCurrentStory(prevStory);
      setIsPaused(false);
      setProgress(0); 
    }
  };
  

  // const formatCreatedAt = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleTimeString('vi-VN', { 
  //     hour: '2-digit', 
  //     minute: '2-digit',
  //     hour12: false 
  //   });
  // };

  const groupedStories = stories.reduce((acc: { [key: string]: StoryModel[] }, story) => {
    if (!acc[story.user._id]) {
      acc[story.user._id] = [];
    }
    const exists = acc[story.user._id].some(s => s._id === story._id);
    if (!exists) {
      acc[story.user._id].push(story);
    }
    return acc;
  }, {});
  
  const nextStories = () => {
    const maxStartIndex = Math.max(0, stories.length - storiesPerPage);
    setStartIndex((prev) => Math.min(prev + 1, maxStartIndex));
  };

  const prevStories = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0)); 
  };

  const visibleStories = stories.slice(startIndex, startIndex + storiesPerPage);

  return (
    <div className="relative">
      {/* Stories List */}
      <div className="flex items-center justify-center space-x-4 p-4 overflow-hidden">
        {startIndex > 0 && (
          <button
            onClick={prevStories}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-400 z-10"
          >
            <ChevronLeft />
          </button>
        )}

        <div className={`flex space-x-4 transition-transform duration-300 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          {visibleStories.map((story) => (
            <div
              key={story._id}
              onClick={() => openStoryViewer(story)}
              className="w-40 h-80 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer relative"
            >
              <img
                src={story.imageUrl}
                alt={story.user.displayName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                <p className="text-white text-sm">
                  {story.user.displayName}
                  <span className="text-xs ml-2">({story.totalStories})</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {startIndex + storiesPerPage < stories.length && (
          <button
            onClick={nextStories}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-300 transition-all duration-300 ease-in-out hover:bg-gray-400 z-10"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {isPopupVisible && currentStory && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsPopupVisible(false)}
            className="absolute top-4 right-4 text-white text-2xl z-50 hover:bg-white/10 rounded-full p-2"
          >
            ×
          </button>
          {showConfirmDialog && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              {/* Overlay */}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50" 
                onClick={handleCancelDelete}
              />
              
              {/* Dialog */}
              <div className="relative bg-white rounded-lg p-6 min-w-[300px] z-[61]">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Xác nhận xóa
                </h3>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa story này không?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Container with Border */}
          <div className="relative w-[33vw] h-screen bg-black border-x-2 border-white">
            {/* Top Section with Progress Bars */}
            <div className="p-4 space-y-4">
              {/* Progress Bars */}
              <div className="flex space-x-1 z-40">
                {Array.from({ length: currentStory.totalStories }).map((_, index) => (
                  <div
                    key={index}
                    className="h-1 flex-1 bg-gray-600 rounded-full overflow-hidden"
                  >
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width: `${index === currentStory.position ? progress : index < currentStory.position ? 100 : 0}%`
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Controls Row */}
              <div className="flex justify-between items-center">
                {/* Left Side - User Info */}
                <div className="flex items-center space-x-2 text-white">
                  <img 
                    src={currentStory.user.avatarUrl} 
                    alt={currentStory.user.displayName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <p className="font-semibold text-sm">{currentStory.user.displayName}</p>
                    <p className="text-xs opacity-75">{currentStory.createdAt}</p>
                  </div>
                </div>

                {/* Right Side - Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="text-white p-2 hover:bg-white/10 rounded-full"
                  >
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                  </button>

                  {currentStory.isOwner === 1 && (
                    <button
                    onClick={handleDeleteClick}
                    className="text-white p-2 hover:bg-red-600/20 rounded-full"
                  >
                    <Trash2 size={20} />
                  </button>
                  )}
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className="relative h-[calc(100vh-116px)]"> {/* Adjust height based on header size */}
              <img
                src={currentStory.imageUrl}
                alt={currentStory.user.displayName}
                className="w-full h-full object-contain"
              />

           {/* Navigation Buttons */}
           {currentStory.previousStory && (
                <button
                  onClick={handlePrevStory}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 z-50 rounded-full transition-colors"
                >
                  <ChevronLeft size={30} />
                </button>
              )}

              {currentStory.nextStory && (
                <button
                  onClick={handleNextStory}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 z-50 rounded-full transition-colors"
                >
                  <ChevronRight size={30} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
       <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default StoryViewer;