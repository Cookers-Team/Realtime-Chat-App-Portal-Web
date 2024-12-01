import React, { useEffect, useState } from "react";
import { User, Mail, Phone, Calendar, Info, Briefcase, X } from "lucide-react";
import { Friends } from "../../models/profile/chat";
import useFetch from "../../hooks/useFetch";
import UserIcon from "../../assets/user_icon.png";

const UserInfoPopup = ({
  user,
  onClose,
  onAddFriend,
  onFowardMessage,
}: any) => {
  if (!user) return null;

  console.log("user:", user);

  const { get } = useFetch();

  const [isLoading, setIsLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [friendObject, setFriendObject] = useState<Friends | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      setIsLoading(true);
      try {
        const response = await get("/v1/friendship/list", { getListKind: 0 });
        console.log("response get list friends:", response);
        if (response.result && Array.isArray(response.data.content)) {
          setIsFriend(
            response.data.content.some(
              (friend: any) =>
                friend.friend._id === user._id && friend.status === 2
            )
          );
          setFriendObject(
            response.data.content.find(
              (friend: any) =>
                friend.friend._id === user._id && friend.status === 2
            )
          );
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bạn bè:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, []);

  console.log("isFriend:", isFriend);
  console.log("friendObject:", friendObject);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <X size={24} />
        </button>

        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src={user.avatarUrl || UserIcon}
              alt={user.displayName}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        <div className="text-center mt-14 px-6">
          <h2 className="text-xl font-bold text-gray-800">
            {user.displayName}
          </h2>
        </div>

        <div className="mt-6 px-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">nguyenvana@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="font-medium">0312345678</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Ngày sinh</p>
              <p className="font-medium">12/06/2003</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Info size={20} className="text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Giới thiệu</p>
              <p className="font-medium text-gray-700">
                {user.bio || "Chưa có thông tin giới thiệu"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-6 mb-6 px-6">
          {isLoading ? (
            <button
              className="bg-gray-400 text-white px-6 py-2 rounded-full shadow-md cursor-not-allowed"
              disabled
            >
              Đang tải...
            </button>
          ) : isFriend ? (
            <button
              className="bg-blue-100 text-blue-700 px-6 py-2 rounded-full shadow-md hover:bg-blue-200 transition-colors"
              onClick={() => onFowardMessage(friendObject)} // Truyền toàn bộ đối tượng friend vào
            >
              Nhắn tin
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
              onClick={() => onAddFriend(user)}
            >
              Kết bạn
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoPopup;
