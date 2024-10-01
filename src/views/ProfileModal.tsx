import React, { useState, useEffect } from "react";
import { remoteUrl } from "../types/constant";

interface ProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isVisible, onClose }) => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(`${remoteUrl}/v1/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Lỗi khi tải thông tin người dùng.");
          }

          const data = await response.json();
          setProfileData(data.data);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg w-11/12 md:w-1/3 p-6 relative shadow-xl transition-transform transform hover:scale-105">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition duration-150"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Thông tin cá nhân
        </h2>

        {loading && <p className="text-center text-blue-500">Đang tải...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {profileData && (
          <div className="flex flex-col items-center">
            <img
              src={profileData.avatarUrl}
              alt="Avatar"
              className="rounded-full w-28 h-28 mb-4 object-cover border-4 border-blue-300 shadow-lg"
            />

            <h3 className="text-xl font-semibold text-gray-800">
              {profileData.displayName || "Chưa có"}
            </h3>

            <div className="mt-4 text-center space-y-2 w-full">
              <div>
                <p className="text-gray-600">Số điện thoại:</p>
                <p className="font-medium">{profileData.phone || "Chưa có"}</p>
              </div>

              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{profileData.email || "Chưa có"}</p>
              </div>

              <div>
                <p className="text-gray-600">Tiểu sử:</p>
                <p className="font-medium">
                  {profileData.bio || "Chưa có tiểu sử"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-150"
            // onClick={() => setEditModalVisible(true)}
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
