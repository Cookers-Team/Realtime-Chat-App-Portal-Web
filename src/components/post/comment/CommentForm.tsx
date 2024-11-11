// import React, { useState, useRef } from 'react';
// import { Image } from 'lucide-react';

// interface CommentFormProps {
//   onSubmit: (content: string, imageUrl?: string) => Promise<void>;
//   onCancel?: () => void;
//   initialValue?: string;
//   placeholder?: string;
// }

// const CommentForm: React.FC<CommentFormProps> = ({
//   onSubmit,
//   onCancel,
//   initialValue = '',
//   placeholder = 'Viết bình luận...'
// }) => {
//   const [content, setContent] = useState(initialValue);
//   const [imageUrl, setImageUrl] = useState<string>();
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (content.trim() || imageUrl) {
//       await onSubmit(content.trim(), imageUrl);
//       setContent('');
//       setImageUrl(undefined);
//     }
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setUploading(true);
//       try {
//         const formData = new FormData();
//         formData.append('file', file);
        
//         // Implement your image upload logic here
//         // const response = await fetch('/api/upload', {
//         //   method: 'POST',
//         //   body: formData,
//         // });
//         // const data = await response.json();
//         // setImageUrl(data.url);
//       } catch (error) {
//         console.error('Error uploading image:', error);
//       } finally {
//         setUploading(false);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-2">
//       <div className="flex items-start space-x-2">
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder={placeholder}
//           rows={2}
//           className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//         />
//       </div>

//       {imageUrl && (
//         <div className="relative inline-block">
//           <img
//             src={imageUrl}
//             alt="Upload preview"
//             className="max-h-32 rounded-lg"
//           />
//           <button
//             type="button"
//             onClick={() => setImageUrl(undefined)}
//             className="absolute top-1 right-1 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
//           >
//             ×
//           </button>
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <div className="flex space-x-2">
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleImageUpload}
//             accept="image/*"
//             className="hidden"
//           />
//           <button
//             type="button"
//             onClick={() => fileInputRef.current?.click()}
//             className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
//             disabled={uploading}
//           >
//             <Image size={20} />
//           </button>
//         </div>

//         <div className="flex space-x-2">
//           {onCancel && (
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               Hủy
//             </button>
//           )}
//           <button
//             type="submit"
//             disabled={!content.trim() && !imageUrl}
//             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Gửi
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export {CommentForm };