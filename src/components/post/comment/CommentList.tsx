// import React from 'react';
// import {CommentItem} from './CommentItem';
// import { CommentModel } from '../../../models/comment/CommentModel';

// interface CommentListProps {
//   comments: CommentModel[];
//   onAddReply: (content: string, imageUrl?: string, parentId?: string) => Promise<void>;
// }

// const CommentList: React.FC<CommentListProps> = ({ comments, onAddReply }) => {
//   // Organize comments into parent and child structure
//   const organizedComments = comments.reduce((acc, comment) => {
//     if (comment.isChildren === 0) {
//       // This is a parent comment
//       acc[comment._id] = {
//         parent: comment,
//         children: []
//       };
//     } else {
//       // This is a child comment
//       const parentId = comment.parent._id;
//       if (acc[parentId]) {
//         acc[parentId].children.push(comment);
//       }
//     }
//     return acc;
//   }, {} as Record<string, { parent: CommentModel, children: CommentModel[] }>);

//   return (
//     <div className="space-y-4">
//       {Object.values(organizedComments).map(({ parent, children }) => (
//         <div key={parent._id} className="space-y-2">
//           <CommentItem 
//             comment={parent}
//             onAddReply={onAddReply}
//             isChild={false}
//           />
//           {children.length > 0 && (
//             <div className="ml-12 space-y-2">
//               {children.map(child => (
//                 <CommentItem
//                   key={child._id}
//                   comment={child}
//                   onAddReply={onAddReply}
//                   isChild={true}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };
// export {CommentList};