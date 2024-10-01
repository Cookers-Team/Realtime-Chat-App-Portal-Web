// import { useState } from "react";

// interface EditProfileModalProps {
//   isVisible: boolean;
//   onClose: () => void;
//   profileData: UserProfile;
//   onSave: (updatedData: UserProfile) => void;
// }

// const EditProfileModal: React.FC<EditProfileModalProps> = ({
//   isVisible,
//   onClose,
//   profileData,
//   onSave,
// }) => {
//   const [formData, setFormData] = useState<UserProfile>(profileData);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = () => {
//     onSave(formData);
//     onClose(); // Đóng modal sau khi lưu
//   };

//   if (!isVisible) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
//       <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6 relative shadow-xl">
//         {/* Nút đóng */}
//         <button
//           className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition duration-150"
//           onClick={onClose}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         {/* Form chỉnh sửa thông tin */}
//         <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
//           Chỉnh sửa thông tin cá nhân
//         </h2>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-gray-600">Tên hiển thị</label>
//             <input
//               type="text"
//               name="displayName"
//               value={formData.displayName}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">Số điện thoại</label>
//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">Tiểu sử</label>
//             <textarea
//               name="bio"
//               value={formData.bio}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-600">URL Avatar</label>
//             <input
//               type="text"
//               name="avatarUrl"
//               value={formData.avatarUrl}
//               onChange={handleInputChange}
//               className="w-full border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Nút Lưu */}
//         <div className="mt-6 flex justify-center">
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-150"
//             onClick={handleSave}
//           >
//             Lưu thay đổi
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
