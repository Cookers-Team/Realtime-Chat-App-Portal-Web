import React, { useState, useEffect, useCallback } from 'react';
import { XCircle, ThumbsUp, MessageCircle, Share2, MoreHorizontal, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import { CommentModel } from '../../models/comment/CommentModel';
import { remoteUrl } from '../../types/constant';
import { toast } from 'react-toastify';
//import ChildComments from '../post/comment/ChildComments';
import CommentItem from './comment/CommentItem';
import useFetch from '../../hooks/useFetch';

interface PostDetailProps {
  postId: string;
  postContent: string | null;
  imageUrls: string[];
  totalComments: number;
  onClose: () => void;
  author?: {
    name: string;
    avatarUrl: string;
  };
}
interface CommentState {
  parentComments: CommentModel[];
  childCommentsMap: { [key: string]: CommentModel[] };
  hasMoreParents: boolean;
  parentPage: number;
  childPagesMap: { [key: string]: number };
  loading: boolean;
}
const PostDetail: React.FC<PostDetailProps> = ({
  postId,
  postContent,
  imageUrls,
  totalComments,
  onClose,
  author = { name: 'Anonymous', avatarUrl: '/default-avatar.png' }
}) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [sortOption, setSortOption] = useState<'all' | 'highlighted'>('all');
  const [visibleParents, setVisibleParents] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(75);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { get, del, loading } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [commentState, setCommentState] = useState<CommentState>({
    parentComments: [],
    childCommentsMap: {},
    hasMoreParents: true,
    parentPage: 0,
    childPagesMap: {},
    loading: false
  });
  const commentSize = 3;

  const PARENT_PAGE_SIZE = 5;
  const CHILD_PAGE_SIZE = 5;

  // Fetch parent comments
  const fetchComments = useCallback(async (page: number = 0) => {
    if (commentState.loading) return;
  
    setCommentState(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await get('/v1/comment/list', {
        post: postId,
        page: page,
        size: PARENT_PAGE_SIZE,
        ignoreChildren: 1,
      });
   
      if (response.result) {
        const newComments = response.data.content;
        
        setCommentState(prev => ({
          ...prev,
          parentComments: page === 0 ? newComments : [...prev.parentComments, ...newComments],
          hasMoreParents: newComments.length === PARENT_PAGE_SIZE,
          parentPage: page,
          loading: false
        }));
        
        // Update `comments` state with parent comments for rendering
        setComments(page === 0 ? newComments : [...comments, ...newComments]);
      } else {
        toast.error('Không thể tải bình luận của bài viết');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Đã có lỗi xảy ra khi tải bình luận');
    } finally {
      setCommentState(prev => ({ ...prev, loading: false }));
    }
  }, [get, postId, comments]);
  

  // Fetch child comments for a specific parent
  const fetchChildComments = useCallback(async (parentId: string, page: number = 0) => {
    if (isLoading) return;
    
    setIsLoading(true); // Sử dụng state loading riêng
    
    try {
      console.log("Fetching child comments for parent:", parentId, "page:", page);
      const response = await get('/v1/comment/list', {
        parent: parentId,
        page: page,
        size: CHILD_PAGE_SIZE,
        isPaged: '1'
      });
      
      console.log("API Response:", response);

      if (response.result) {
        const newChildComments = response.data.content;
        console.log("New child comments:", newChildComments);
        
        setCommentState(prev => {
          const existingComments = prev.childCommentsMap[parentId] || [];
          const updatedComments = page === 0 
            ? newChildComments 
            : [...existingComments, ...newChildComments];

          return {
            ...prev,
            childCommentsMap: {
              ...prev.childCommentsMap,
              [parentId]: updatedComments
            },
            childPagesMap: {
              ...prev.childPagesMap,
              [parentId]: page
            }
          };
        });
  
        return newChildComments.length === CHILD_PAGE_SIZE;
      } else {
        toast.error('Không thể tải bình luận phản hồi');
        return false;
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
      toast.error('Đã có lỗi xảy ra khi tải bình luận phản hồi');
      return false;
    } finally {
      setIsLoading(false); // Reset loading state sau khi hoàn thành
    }
  }, [get]);

  // Cập nhật loadMoreChildComments
  const loadMoreChildComments = useCallback((parentId: string) => {
    if (isLoading) { // Sử dụng isLoading thay vì commentState.loading
      console.log("Loading state is true, returning");
      return;
    }
    
    console.log("Loading more comments for parent:", parentId);
    const currentPage = commentState.childPagesMap[parentId] || -1;
    const nextPage = currentPage + 1;
    console.log("Fetching page:", nextPage);
    
    fetchChildComments(parentId, nextPage);
  }, [isLoading, commentState.childPagesMap, fetchChildComments]);


  // Load more parent comments
  const loadMoreComments = useCallback(() => {
    if (!commentState.hasMoreParents || commentState.loading) return;
    const nextPage = commentState.parentPage + 1;
    fetchComments(nextPage);
  }, [commentState.hasMoreParents, commentState.loading, commentState.parentPage, fetchComments]);


  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${remoteUrl}/v1/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          postId,
          content: newComment,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setNewComment('');
        fetchComments(); // Refresh comments after posting
      } else {
        toast.error('Không thể đăng bình luận');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Đã có lỗi xảy ra khi đăng bình luận');
    }
  };

  
  // Initial load of parent comments
  useEffect(() => {
    fetchComments(0);
  }, [fetchComments]);

  return (
<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-lg my-4">
        {/* Fixed Header */}
        <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white z-10">
          <h2 className="text-xl font-semibold">Bài viết của {author.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {/* Author Info */}
          <div className="flex items-center mb-4">
            <img 
              src={author.avatarUrl} 
              alt={author.name} 
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <p className="font-semibold">{author.name}</p>
              <p className="text-sm text-gray-500">1 giờ trước</p>
            </div>
            <button className="ml-auto text-gray-500">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Post Content */}
          <p className="mb-4">{postContent}</p>
          
          {/* Images */}
          {imageUrls.length > 0 && (
            <div className="relative">
              <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt={`Post Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                {imageUrls.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {imageUrls.length}
                  </div>
                )}
              </div>
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex justify-between items-center py-2 border-y text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              {likeCount > 0 && (
                <span className="flex items-center gap-1">
                  <div className="bg-blue-500 p-1 rounded-full">
                    <ThumbsUp size={12} className="text-white" />
                  </div>
                  {likeCount}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <span>{totalComments} bình luận</span>
            </div>
          </div>

          {/* Comments List */}
          {commentState.parentComments.slice(0, visibleParents).map(comment => (
      <div key={comment._id} className="space-y-2">
        <CommentItem comment={comment} />
        {comment.totalChildren > 0 && (
          <>
            <button
              type="button"
              onClick={() => loadMoreChildComments(comment._id)}
              className="ml-8 mt-2 text-blue-500 font-semibold hover:underline"
              disabled={isLoading} // Disable button khi đang loading
            >
              {isLoading ? 'Đang tải...' : `Xem phản hồi (${comment.totalChildren})`}
            </button>
            
            {commentState.childCommentsMap[comment._id] && (
              <div className="ml-8 space-y-2">
                {commentState.childCommentsMap[comment._id].map(childComment => (
                  <CommentItem 
                    key={childComment._id} 
                    comment={childComment} 
                    isChild 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    ))}
          {/* Load More Comments Button */}
          {comments.filter(comment => comment.isChildren === 0).length > visibleParents && (
            <button 
              onClick={() => setVisibleParents(prev => prev + 5)}
              className="mt-4 text-blue-500 font-semibold hover:underline w-full text-center py-2"
            >
              Xem thêm bình luận
            </button>
          )}
        </div>

        {/* Fixed Comment Input (Footer) */}
        <div className="sticky bottom-0 bg-white p-4 border-t">
          <form onSubmit={handleSubmitComment} className="flex items-center gap-2">
            <img 
              src="/default-avatar.png" 
              className="w-8 h-8 rounded-full" 
              alt="Current user" 
            />
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận..."
                className="w-full px-4 py-2 bg-gray-100 rounded-full pr-10"
              />
              <button type="button" className="absolute right-3 top-2 text-gray-500">
                <Smile size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



export default PostDetail;