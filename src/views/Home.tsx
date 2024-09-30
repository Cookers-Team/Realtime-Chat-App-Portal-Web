import React, { useState } from "react";
import NavBar from "../components/NavBar"; // Import NavBar
import { LoadingDialog } from "../components/Dialog";
import Profile from "./ProfileModal";

const Home = () => {
  const [selectedSection, setSelectedSection] = useState(""); // Trạng thái để lưu phần được chọn
  const [isProfileVisible, setProfileVisible] = useState(false);
  return (
    <div className="flex h-screen">
      {/* Phần 1: Thanh điều hướng (NavBar) */}
      <NavBar
        setSelectedSection={setSelectedSection}
        setProfileVisible={setProfileVisible}
      />
      {/* Hiển thị modal Profile khi cần */}
      {isProfileVisible && (
        <Profile
          isVisible={isProfileVisible}
          onClose={() => setProfileVisible(false)}
        />
      )}
      {/* Phần 2: Khu vực tìm kiếm */}
      <div className="w-1/5 bg-gray-200 p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="pl-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-gray-600">
          Dùng ô tìm kiếm để tìm tin nhắn, bạn bè, bài đăng...
        </p>
      </div>
      {/* Phần 3: Khu vực hiển thị nội dung */}
      <div className="w-4/5 bg-white p-4">
        {selectedSection === "messages" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Tin nhắn</h2>
            <p>Hiển thị nội dung tin nhắn tại đây...</p>
          </div>
        )}
        {selectedSection === "posts" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Bài đăng</h2>
            <p>Hiển thị nội dung bài đăng tại đây...</p>
          </div>
        )}
        {selectedSection === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cài đặt</h2>
            <p>Hiển thị các cài đặt tại đây...</p>
          </div>
        )}
        {selectedSection === "" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Chọn một mục từ thanh điều hướng
            </h2>
          </div>
        )}
      </div>
      <LoadingDialog isVisible={false} />
    </div>
  );
};

export default Home;
