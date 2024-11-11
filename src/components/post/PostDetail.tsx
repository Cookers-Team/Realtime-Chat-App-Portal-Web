// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { XCircle } from 'lucide-react';
// import { CommentModel } from '../../models/comment/CommentModel';
// import { remoteUrl } from '../../types/constant';
// import { toast } from 'react-toastify';

// interface PostDetailProps {
//   postId: string;
//   postContent: string | null;
//   imageUrls: string[];
//   onClose: () => void;
// }

// const PostDetail: React.FC<PostDetailProps> = ({
//   postId,
//   postContent,
//   imageUrls,
//   onClose,
// }) => {
//   const [comments, setComments] = useState<CommentModel[]>([]);
//   const [sortOption, setSortOption] = useState<'all' | 'highlighted'>('all');
//   const [visibleParents, setVisibleParents] = useState(5);
  
//   useEffect(() => {
//     fetchComments();
//   }, [postId, sortOption]);

//   const fetchComments = async () => {
//     try {
//       const response = await fetch(`${remoteUrl}/v1/comment/list?postId=${postId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       const data = await response.json();
//       if (data.result) {
//         // Sắp xếp bình luận theo lựa chọn của người dùng
//         const sortedComments = sortOption === 'highlighted'
//           ? data.data.content.sort((a: CommentModel, b: CommentModel) => b.totalReactions - a.totalReactions)
//           : data.data.content;
//         setComments(sortedComments);
//       } else {
//         toast.error('Không thể tải bình luận của bài viết');
//       }
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     }
//   };
  
//   // Hàm hiển thị thêm 5 bình luận cha
//   const loadMoreParents = () => {
//     setVisibleParents(visibleParents + 5);
//   };

//   // Hàm lọc và tổ chức các bình luận cha và con
//   const renderComments = () => {
//     // Lọc và hiển thị bình luận cha
//     const parentComments = comments.filter((comment) => comment.isChildren === 0).slice(0, visibleParents);
//     return parentComments.map((parentComment) => (
//       <div key={parentComment._id} className="mb-4">
//         <CommentItem comment={parentComment} />

//         {/* Hiển thị các bình luận con nếu có */}
//         {parentComment.totalChildren > 0 && (
//           <ChildComments parentId={parentComment._id} comments={comments} />
//         )}
//       </div>
//     ));
//   };

//   return (
//     <div className="fixed z-50 inset-0 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold">Post Details</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               <XCircle size={24} />
//             </button>
//           </div>
//           <p>{postContent}</p>
//           {imageUrls.length > 0 && (
//             <div className="my-4">
//               {imageUrls.map((url, index) => (
//                 <img key={index} src={url} alt={`Post Image ${index + 1}`} className="w-full mb-2" />
//               ))}
//             </div>
//           )}
          
//           {/* Dropdown chọn sắp xếp */}
//           <select
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value as 'all' | 'highlighted')}
//             className="mb-4 p-2 border rounded"
//           >
//             <option value="all">Hiển thị tất cả</option>
//             <option value="highlighted">Hiển thị nổi bật nhất</option>
//           </select>
          
//           <h3 className="text-xl font-bold mt-6 mb-4">Comments</h3>
//           {renderComments()}
          
//           {/* Nút hiển thị thêm bình luận cha */}
//           {comments.filter((comment) => comment.isChildren === 0).length > visibleParents && (
//             <button onClick={loadMoreParents} className="mt-4 p-2 bg-blue-500 text-white rounded">
//               Hiển thị thêm bình luận
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Component cho bình luận cha và con
// interface CommentItemProps {
//   comment: CommentModel;
//   isChild?: boolean;
// }

// const CommentItem: React.FC<CommentItemProps> = ({ comment, isChild = false }) => (
//   <div className={`flex ${isChild ? 'ml-6' : ''} mb-4`}>
//     <img
//       src={comment.user.avatarUrl || '/default-avatar.png'}
//       alt={comment.user.displayName}
//       className="w-8 h-8 rounded-full mr-2"
//     />
//     <div>
//       <p className="font-semibold">{comment.user.displayName}</p>
//       <p className="text-sm text-gray-500">{comment.createdAt}</p>
//       <p>{comment.content}</p>
//     </div>
//   </div>
// );

// // Component hiển thị và lazy loading bình luận con
// interface ChildCommentsProps {
//   parentId: string;
//   comments: CommentModel[];
// }

// const ChildComments: React.FC<ChildCommentsProps> = ({ parentId, comments }) => {
//   const [visibleChildren, setVisibleChildren] = useState(5);

//   // Lọc bình luận con theo `parentId`
//   const childComments = comments.filter(
//     (comment) => comment.isChildren === 1 && comment.parent?._id === parentId
//   );

//   const loadMoreChildren = () => {
//     setVisibleChildren(visibleChildren + 5);
//   };

//   return (
//     <>
//       {childComments.slice(0, visibleChildren).map((childComment) => (
//         <CommentItem key={childComment._id} comment={childComment} isChild />
//       ))}
//       {childComments.length > visibleChildren && (
//         <button onClick={loadMoreChildren} className="ml-6 mt-2 text-blue-500">
//           Hiển thị thêm bình luận
//         </button>
//       )}
//     </>
//   );
// };

// export default PostDetail;
