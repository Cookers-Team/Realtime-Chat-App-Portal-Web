// // ChildComments.tsx
// import React, { useState } from 'react';
// import CommentItem from './CommentItem';
// import { CommentModel } from '../../../models/comment/CommentModel';

// interface ChildCommentsProps {
//   parentId: string;
//   comments: CommentModel[];
// }

// const ChildComments: React.FC<ChildCommentsProps> = ({ parentId, comments }) => {
//   const [visibleChildren, setVisibleChildren] = useState(5);

//   const childComments = comments.filter(
//     comment => comment.isChildren === 1 && comment.parent?._id === parentId
//   );

//   return (
//     <div className="mt-2">
//       {childComments.slice(0, visibleChildren).map(comment => (
//         <CommentItem key={comment._id} comment={comment} isChild />
//       ))}
      
//       {childComments.length > visibleChildren && (
//         <button
//           onClick={() => setVisibleChildren(prev => prev + 5)}
//           className="ml-8 mt-2 text-blue-500 font-semibold hover:underline"
//         >
//           Xem thêm phản hồi
//         </button>
//       )}
//     </div>
//   );
// };

// export default ChildComments;
