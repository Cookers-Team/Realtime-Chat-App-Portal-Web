import React, { useState, useEffect } from "react";
import { remoteUrl } from "../types/constant";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface UserProfile {
  displayName: string;
  bio: string;
  birthDate: Date | null;
  avatarUrl: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    displayName: "",
    bio: "",
    birthDate: null,
    avatarUrl: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(`${remoteUrl}/v1/user/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) throw new Error("Error fetching profile data");

          const data = await response.json();
          setFormData({
            ...data.data,
            birthDate: data.data.birthDate
              ? new Date(data.data.birthDate)
              : null,
          });
        } catch (error: any) {
          setError(error.message);
        }
      };

      fetchProfile();
    }
  }, [isVisible]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, birthDate: date }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${remoteUrl}/v1/user/update-profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error updating profile");

      onClose();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className=" flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg w-full md:w-1/2 lg:w-1/3 p-8 relative shadow-xl transition-transform transform hover:scale-100">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
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

        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">
          Chỉnh sửa hồ sơ
        </h2>

        {loading && <p className="text-center text-blue-500">Đang lưu...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={imagePreview || formData.avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-lg mb-6"
            />
            <input
              type="file"
              accept="image/*"
              className="absolute bottom-0 right-0 opacity-0 w-10 h-10 cursor-pointer"
              onChange={handleImageChange}
            />
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 12m0-9a9 9 0 110 18 9 9 0 010-18z"
                />
              </svg>
            </div>
          </div>

          <div className="w-full space-y-5">
            <div>
              <label className="block text-gray-600">Tên hiển thị</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Nhập tên hiển thị"
              />
            </div>

            <div>
              <label className="block text-gray-600">Tiểu sử</label>
              <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                placeholder="Đôi nét về bạn"
              />
            </div>

            <div>
              <label className="block text-gray-600">Ngày sinh</label>
              <DatePicker
                selected={formData.birthDate}
                onChange={handleDateChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày sinh của bạn"
              />
            </div>
          </div>

          <button
            className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-150"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
