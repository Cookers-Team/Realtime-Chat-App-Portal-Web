import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Smile } from 'lucide-react';
import { CommentModel } from '../../../models/comment/CommentModel';
import { remoteUrl } from '../../../types/constant';
import { toast } from 'react-toastify';
import CommentItem from '../comment/CommentItem';
import useFetch from '../../../hooks/useFetch';
import { Oval } from 'react-loader-spinner';

interface CommentState {
  parentComments: CommentModel[];
  childCommentsMap: { [key: string]: CommentModel[] };
  hasMoreParents: boolean;
  parentPage: number;
  childPagesMap: { [key: string]: number };
  loading: boolean;
}
interface LoadingStates {
  [key: string]: boolean;
}

const CommentsSection = ({ postId, totalComments }: any) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [visibleParents, setVisibleParents] = useState(5);
  const [newComment, setNewComment] = useState('');
  const { get } = useFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [commentState, setCommentState] = useState<CommentState>({
    parentComments: [],
    childCommentsMap: {},
    hasMoreParents: true,
    parentPage: 0,
    childPagesMap: {},
    loading: false
  });
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({});

  const PARENT_PAGE_SIZE = 2;
  const CHILD_PAGE_SIZE = 2;

  const fetchComments = useCallback(async (page: number) => {
    if (!commentState.hasMoreParents || commentState.loading) return;
    
    // Prevent loading first page multiple times
    if (page === 0 && commentState.parentComments.length > 0) return;
  
    setCommentState((prev) => ({ ...prev, loading: true }));
  
    try {
      const response = await get('/v1/comment/list', {
        post: postId,
        page,
        size: PARENT_PAGE_SIZE,
        ignoreChildren: 1,
      });
  
      if (response.result) {
        const newComments = response.data.content;
        const totalPages = response.data.totalPages;
  
        setCommentState((prev) => ({
          ...prev,
          parentComments: page === 0 ? newComments : [...prev.parentComments, ...newComments],
          hasMoreParents: page + 1 < totalPages,
          parentPage: page,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentState((prev) => ({ ...prev, loading: false }));
    }
  }, [commentState.hasMoreParents, commentState.loading, commentState.parentComments.length, get, postId]);

  const fetchChildComments = useCallback(async (parentId: string, page: number) => {
    setLoadingStates(prev => ({ ...prev, [parentId]: true })); // Đặt trạng thái loading cho comment cha
    console.log("Fetching child comments for parentId:", parentId, "Page:", page);
  
    try {
      const response = await get('/v1/comment/list', {
        parent: parentId,
        page: page,
        size: CHILD_PAGE_SIZE,
        isPage: 0, 
      });
  
      if (response.result) {
        const newChildComments = response.data.content;
        const totalPages = response.data.totalPages; // Đảm bảo API trả về tổng số trang
        console.log("Fetched child comments:", newChildComments);
        console.log("Total pages:", totalPages);
  
        setCommentState(prev => {
          const existingComments = prev.childCommentsMap[parentId] || [];
          const updatedComments = page === 0
            ? newChildComments
            : [...existingComments, ...newChildComments];
  
          return {
            ...prev,
            childCommentsMap: {
              ...prev.childCommentsMap,
              [parentId]: updatedComments,
            },
            childPagesMap: {
              ...prev.childPagesMap,
              [parentId]: page < totalPages ? page : totalPages - 1, // Đảm bảo không vượt quá totalPages
            },
          };
        });
  
        // Trả về true nếu còn bình luận để tải (page < totalPages), ngược lại là false.
        return page + 1 < totalPages;
      } else {
        toast.error('Không thể tải bình luận phản hồi');
        return false;
      }
    } catch (error) {
      console.error('Error fetching child comments:', error);
      toast.error('Đã có lỗi xảy ra khi tải bình luận phản hồi');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, [parentId]: false })); // Clear trạng thái loading
    }
  }, [get]);
  

  const loadMoreChildComments = useCallback((parentId: string) => {
    const currentPage = commentState.childPagesMap[parentId] ?? -1;
    const nextPage = currentPage + 1;
    fetchChildComments(parentId, nextPage);
  }, [commentState.childPagesMap, fetchChildComments]);

  const loadMoreComments = useCallback(() => {
    if (!commentState.hasMoreParents || commentState.loading) return;
    const nextPage = commentState.parentPage + 1;
    fetchComments(nextPage);
  }, [commentState.hasMoreParents, commentState.loading, commentState.parentPage, fetchComments]);

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
        // Reset state and fetch first page
        setCommentState(prev => ({
          ...prev,
          parentComments: [],
          parentPage: 0,
          hasMoreParents: true
        }));
        fetchComments(0);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && commentState.hasMoreParents && !commentState.loading) {
          loadMoreComments();
        }
      },
      { 
        root: null, 
        rootMargin: '50px', 
        threshold: 0.1  // Trigger khi element hiện 10%
      }
    );
  
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
  
    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loadMoreComments, commentState.hasMoreParents, commentState.loading]);

  return (
    <div>
      <div className="space-y-4">
        {commentState.parentComments.map((comment) => (
           <div key={`parent-${comment._id}`} className="space-y-2">
            <CommentItem comment={comment} />
            {comment.totalChildren > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => loadMoreChildComments(comment._id)}
                  className="ml-8 mt-2 text-blue-500 font-semibold hover:underline"
                  disabled={loadingStates[comment._id]}
                >
                  {loadingStates[comment._id] ? (
                    <div className="flex items-center gap-2">
                      <Oval
                        height={16}
                        width={16}
                        color="#00BFFF"
                        secondaryColor="#ccc"
                        visible={true}
                        ariaLabel="loading"
                      />
                      <span>Đang tải...</span>
                    </div>
                  ) : `Xem phản hồi (${comment.totalChildren})`}
                </button>
                
                {commentState.childCommentsMap[comment._id] && (
                  <div className="ml-8 space-y-2">
                    {commentState.childCommentsMap[comment._id].map(childComment => (
                      <CommentItem 
                        key={`child-${childComment._id}`} 
                        comment={childComment} 
                        isChild 
                      />
                    ))}
                    {/* Loading indicator for child comments */}
                    {loadingStates[comment._id] && (
                      <div className="flex justify-center py-2">
                        <Oval
                          height={24}
                          width={24}
                          color="#00BFFF"
                          secondaryColor="#ccc"
                          visible={true}
                          ariaLabel="loading"
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        
        {commentState.loading && (
          <div className="flex justify-center mt-4">
            <Oval
              height={40}
              width={40}
              color="#00BFFF"
              secondaryColor="#ccc"
              visible={true}
              ariaLabel="loading"
            />
          </div>
        )}
        
        <div ref={observerRef} className="h-4" />
      </div>

      {/* Comment Input */}
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
  );
};

export default CommentsSection;