import React from "react";
import { Search, FileText, Users, Bookmark , MoreVertical } from "lucide-react";

interface PostListItemProps {
  selectedPostSection: string;
  setSelectedPostSection: (section: string) => void;
}

const PostListItem: React.FC<PostListItemProps> = ({
  selectedPostSection,
  setSelectedPostSection,
}) => {
  return (
    <div className="p-4 flex flex-col justify-start">
      {/* Ô tìm kiếm */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài đăng"
          className="pl-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Điều hướng Bài đăng của tôi */}
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedPostSection === "myPosts" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedPostSection("myPosts")}
      >
        <FileText size={24} className="mr-2" />
        <p className="text-lg">Bài đăng của tôi</p>
      </div>

      {/* Điều hướng Bài đăng bạn bè */}
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedPostSection === "friendsPosts" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedPostSection("friendsPosts")}
      >
        <Users size={24} className="mr-2" />
        <p className="text-lg">Bài đăng bạn bè</p>
      </div>

      {/* Điều hướng Bài đăng đã lưu */}
      <div
        className={`mb-2 flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded-md ${
          selectedPostSection === "communityPosts" ? "bg-gray-300" : ""
        }`}
        onClick={() => setSelectedPostSection("communityPosts")}
      >
        <Bookmark size={24} className="mr-2" />
        <p className="text-lg">Bài đăng cộng đồng</p>
      </div>
    </div>
  );
};

export default PostListItem;
