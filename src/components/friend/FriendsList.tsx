import React, { useState, useEffect } from "react";
import { useLoading } from "../../hooks/useLoading";
import { remoteUrl } from "../../types/constant";
import { toast } from "react-toastify";
import InputField from "../InputField";
import { Search, ChevronDown, ChevronUp, MoreVertical, Info, Trash2 } from "lucide-react";
import { LoadingDialog } from "../Dialog";

interface Friend {
  _id: string;
  friendId: string;
  displayName?: string;
  avatarUrl?: string;
  lastLogin?: string;
}

const FriendsList = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const defaultAvatar = "https://via.placeholder.com/150";

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/friendship/list?getListKind=3`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();
      const formattedFriends = data.data.content.map((friendship: any) => {
        return {
          _id: friendship._id,
          friendId: friendship.friend._id,
          displayName: friendship.friend.displayName || "Unknown",
          avatarUrl: friendship.friend.avatarUrl || defaultAvatar,
          lastLogin: friendship.friend.lastLogin || "Chưa đăng nhập",
        };
      });

      setFriends(formattedFriends);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      hideLoading();
    }
  };

  const filteredFriends = friends
    .filter((friend) =>
      friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.displayName || !b.displayName) return 0;
      if (sortOrder === "asc") {
        return a.displayName.localeCompare(b.displayName);
      } else {
        return b.displayName.localeCompare(a.displayName);
      }
    });

  const groupedFriends: { [key: string]: Friend[] } = filteredFriends.reduce(
    (acc, friend) => {
      const firstLetter = friend.displayName?.charAt(0).toUpperCase() || "#";
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(friend);
      return acc;
    },
    {} as { [key: string]: Friend[] }
  );

  const toggleMenu = (friendId: string) => {
    setOpenMenu(openMenu === friendId ? null : friendId);
  };

  const handleViewInfo = (friendId: string) => {
    // Implement view info logic here
    console.log("View info of friend:", friendId);
    setOpenMenu(null);
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      showLoading();
      const response = await fetch(`${remoteUrl}/v1/friendship/delete/${friendshipId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Có lỗi xảy ra khi xóa bạn bè");
        return;
      }

      toast.success("Đã xóa bạn bè thành công");
      setFriends(friends.filter(friend => friend._id !== friendshipId));
    } catch (error) {
      console.error("Lỗi khi xóa bạn bè:", error);
      toast.error("Có lỗi xảy ra khi xóa bạn bè");
    } finally {
      hideLoading();
      setOpenMenu(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Bạn bè ({filteredFriends.length})
        </h2>
      </div>

      <div className="flex items-center mb-4 space-x-2">
        <div className="flex-grow">
          <InputField
            placeholder="Tìm kiếm bạn bè"
            icon={Search}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="h-10"
          />
        </div>

        <div className="flex-shrink-0 -mt-2">
          <button
            className="flex items-center border border-gray-300 px-2 py-2 rounded-md focus:outline-none hover:bg-gray-100 h-10"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <>
                <ChevronUp className="mr-1" /> Tên (A-Z)
              </>
            ) : (
              <>
                <ChevronDown className="mr-1" /> Tên (Z-A)
              </>
            )}
          </button>
        </div>
      </div>

      {Object.keys(groupedFriends).length > 0 ? (
        Object.keys(groupedFriends)
          .sort()
          .map((letter) => (
            <div key={letter} className="mb-6">
              <h3 className="text-lg font-semibold">{letter}</h3>
              {groupedFriends[letter].map((friend) => (
                <div key={friend._id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={friend.avatarUrl || defaultAvatar}
                      alt={friend.displayName || "Unknown"}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">
                        {friend.displayName || "Unknown"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Lần đăng nhập cuối: {friend.lastLogin || "Không rõ"}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(friend._id)}
                      className="p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenu === friend._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleViewInfo(friend.friendId)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <Info size={16} className="mr-2" />
                          Xem thông tin
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friend._id)}
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Xóa bạn bè
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))
      ) : (
        <p className="text-gray-500">Không tìm thấy bạn bè</p>
      )}
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default FriendsList;