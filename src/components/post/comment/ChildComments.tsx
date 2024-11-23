import React, { useState } from 'react';
import { CommentModel } from '../../../models/comment/CommentModel';
import CommentItem from './CommentItem';

const ChildComments = ({
  parentId,
  childComments,
  isLoading,
  onLoadMore,
  totalChildren
}: {
  parentId: string;
  childComments: CommentModel[];
  isLoading: boolean;
  onLoadMore: (parentId: string, page: number) => Promise<{ hasMore: boolean; totalRemaining: number }>;
  totalChildren: number;
}) => {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [remainingComments, setRemainingComments] = useState(totalChildren);
  const [showComments, setShowComments] = useState(false);

  const handleLoadMore = async () => {
    if (!showComments) {
      setShowComments(true);
    }
    
    const result = await onLoadMore(parentId, page);
    setHasMore(result.hasMore);
    setRemainingComments(result.totalRemaining);
    setPage(prev => prev + 1);
  };

  return (
    <div className="mt-2">
      {totalChildren > 0 && (
        <>
          <button
            type="button"
            onClick={handleLoadMore}
            className="text-blue-500 font-semibold hover:underline"
            disabled={isLoading}
          >
            {isLoading ? 'Đang tải...' : showComments 
              ? (hasMore ? `Xem thêm ${remainingComments} phản hồi` : '')
              : `Xem ${totalChildren} phản hồi`}
          </button>
          
          {showComments && childComments && childComments.length > 0 && (
            <div className="ml-8 space-y-2 mt-2">
              {childComments.map(childComment => (
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
  );
};

export default ChildComments;