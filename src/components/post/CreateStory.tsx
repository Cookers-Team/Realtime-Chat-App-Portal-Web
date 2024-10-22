import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { remoteUrl } from '../../types/constant';
import { useLoading } from '../../hooks/useLoading';
import { uploadImage } from "../../types/utils";

const CreateStory = ({ isVisible, setVisible, profile, onButtonClick }: any) => {
  const { showLoading, hideLoading } = useLoading();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Vui lòng chọn hình ảnh");
      return null;
    }

    try {
      showLoading();
      // Gọi hàm uploadImage để tải ảnh lên server
      const imageUrl = await uploadImage(imageFile, async (url, formData) => {
        const response = await fetch(`${remoteUrl}${url}`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        return await response.json();
      });

      hideLoading();

      if (imageUrl) {
        return imageUrl; // Trả về đường dẫn ảnh sau khi upload
      } else {
        toast.error("Lỗi khi tải lên hình ảnh");
        return null;
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải ảnh lên");
      hideLoading();
      return null;
    }
  };

  const handleCreateStory = async () => {
    // Gọi hàm upload để lấy đường dẫn ảnh sau khi tải lên
    const imageUrl = await handleImageUpload();
    if (!imageUrl) {
      return;
    }

    try {
      showLoading();
      const response = await fetch(`${remoteUrl}/v1/story/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ imageUrl }), // Sử dụng đường dẫn ảnh đã tải lên
      });

      const data = await response.json();
      if (data.result) {
        toast.success("Tạo story thành công");
        setVisible(false);
        onButtonClick();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo story");
    } finally {
      hideLoading();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={() => setVisible(false)}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Tạo Story</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Chọn hình ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            onClick={() => setVisible(false)}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleCreateStory}
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStory;
