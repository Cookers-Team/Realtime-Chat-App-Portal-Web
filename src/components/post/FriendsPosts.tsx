// import React, { useState, useEffect } from 'react';
// import PostItem from './PostItem';
// import StoryViewer from './story/StoryViewer';
// import { useLoading } from '../../hooks/useLoading';
// import { remoteUrl } from '../../types/constant';
// import { toast } from 'react-toastify';
// import InputField from '../InputField';
// import { Search } from 'lucide-react';
// import { LoadingDialog } from '../Dialog';
// import { PostModel } from '../../models/post/PostModel';

// const FriendsPosts = () => {
//   const [posts, setPosts] = useState<PostModel[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const { isLoading, showLoading, hideLoading } = useLoading();

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   const fetchPosts = async () => {
//     showLoading();
//     try {
//       const response = await fetch(`${remoteUrl}/v1/post/list?kind=2`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         },
//       });
//       const data = await response.json();
//       if (data.result) {
//         // Filter posts with status === 2 (approved posts)
//         const friendsPosts = data.data.content.filter((post: PostModel) => post.status === 2);
//         setPosts(friendsPosts);
//       } else {
//         toast.error('Không thể tải bài viết của bạn bè');
//       }
//     } catch (error) {
//       toast.error('Đã xảy ra lỗi khi tải bài viết');
//     } finally {
//       hideLoading();
//     }
//   };

//   const handleDeletePost = async (postId: string) => {
//     // Add delete functionality here
//     // After successful deletion, refresh the posts
//     fetchPosts();
//   };

//   const handleEditPost = async (postId: string) => {
//     // Add edit functionality here
//     // After successful edit, refresh the posts
//     fetchPosts();
//   };

//   const filteredPosts = posts.filter((post) =>
//     post.user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="flex flex-col h-full">
//       <div className="sticky top-0 bg-white z-10 shadow-sm">
//         <h1 className="text-xl font-bold text-center py-2 m-0">Bài viết của bạn bè</h1>
//       </div>

//       <div className="flex-grow overflow-y-auto">
//         <div className="p-4">
//           <div className="max-w-2xl mx-auto mb-6">
//             <InputField
//               placeholder="Tìm kiếm bài viết theo tên"
//               icon={Search}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               className="w-full h-10 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
          
//           <div className="bg-white mb-4 relative">
//             <StoryViewer />
//           </div>

//           {filteredPosts.length > 0 ? (
//             filteredPosts.map((post) => (
//               <PostItem
//                 key={post._id}
//                 {...post}
//                 onEdit={() => handleEditPost(post._id)}
//                 onDelete={() => handleDeletePost(post._id)}
//                 isPost={2}
//               />
//             ))
//           ) : (
//             <p className="text-center text-gray-500">Không có bài viết nào từ bạn bè.</p>
//           )}
//         </div>
//       </div>

//       <LoadingDialog isVisible={isLoading} />
//     </div>
//   );
// };

// export default FriendsPosts;
