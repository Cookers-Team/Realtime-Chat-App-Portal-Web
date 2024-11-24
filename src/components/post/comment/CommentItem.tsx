// import React, { useState } from 'react';
// import { MoreVertical } from 'lucide-react';
// import { CommentModel } from '../../../models/comment/CommentModel';
// import {CommentForm} from './CommentForm';

// interface CommentItemProps {
//   comment: CommentModel;
//   onAddReply: (content: string, imageUrl?: string, parentId?: string) => Promise<void>;
//   isChild: boolean;
// }

// const CommentItem: React.FC<CommentItemProps> = ({ comment, onAddReply, isChild }) => {
//   const [showReplyForm, setShowReplyForm] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const handleSubmitReply = async (content: string, imageUrl?: string) => {
//     await onAddReply(content, imageUrl, comment._id);
//     setShowReplyForm(false);
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//       <div className="flex items-start">
//         <img
//           src={comment.user.avatarUrl || '/default-avatar.png'}
//           alt={comment.user.displayName}
//           className="w-8 h-8 rounded-full mr-3"
//         />
        
//         <div className="flex-grow">
//           <div className="flex items-center justify-between">
//             <div>
//               <span className="font-medium">{comment.user.displayName}</span>
//               {comment.isUpdated === 1 && (
//                 <span className="text-xs text-gray-500 ml-2">(đã chỉnh sửa)</span>
//               )}
//             </div>
            
//             {comment.isOwner === 1 && (
//               <div className="relative">
//                 <button
//                   onClick={() => setShowMenu(!showMenu)}
//                   className="p-1 hover:bg-gray-100 rounded-full"
//                 >
//                   <MoreVertical size={16} />
//                 </button>
                
//                 {showMenu && (
//                   <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
//                     <button
//                       onClick={() => {
//                         setIsEditing(true);
//                         setShowMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Chỉnh sửa
//                     </button>
//                     <button
//                       onClick={() => {
//                         // Implement delete logic
//                         setShowMenu(false);
//                       }}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                     >
//                       Xóa
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {isEditing ? (
//             <CommentForm
//               initialValue={comment.content || ''}
//               onSubmit={async (content, imageUrl) => {
//                 // Implement edit logic
//                 setIsEditing(false);
//               }}
//               onCancel={() => setIsEditing(false)}
//             />
//           ) : (
//             <>
//               <p className="text-gray-800 mt-1">{comment.content}</p>
//               {comment.imageUrl && (
//                 <img
//                   src={comment.imageUrl}
//                   alt="Comment attachment"
//                   className="mt-2 max-w-xs rounded-lg"
//                 />
//               )}
//             </>
//           )}

//           <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
//             <span>{comment.createdAt}</span>
//             <button 
//               onClick={() => setShowReplyForm(!showReplyForm)}
//               className="hover:text-gray-700"
//             >
//               Phản hồi
//             </button>
//             <button className="hover:text-gray-700">
//               ❤️ {comment.totalReactions}
//             </button>
//           </div>

//           {showReplyForm && (
//             <div className="mt-2">
//               <CommentForm
//                 onSubmit={handleSubmitReply}
//                 onCancel={() => setShowReplyForm(false)}
//                 placeholder="Viết phản hồi..."
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// export {CommentItem};