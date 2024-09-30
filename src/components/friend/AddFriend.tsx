import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import {jwtDecode} from 'jwt-decode';
import { remoteUrl } from '../../types/constant';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  displayName: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
}

interface Friendship {
  sender: User;
  receiver: User;
}

interface AddFriendProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFriend: React.FC<AddFriendProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]); 
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]); 


  const getUserIdFromToken = () => {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token); 
      return decodedToken?.userId;
    } catch (error) {
      console.error("Lỗi khi giải mã token:", error);
      return null;
    }
  };

  
  const userId = getUserIdFromToken();

  
  useEffect(() => {
    fetchUsers();
    fetchFriendships();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${remoteUrl}/v1/user/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();
      setUsers(data.data.content); 
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi lấy danh sách người dùng.');
    }
  };

 
  const fetchFriendships = async () => {
    try {
      const response = await fetch(`${remoteUrl}/v1/friendship/friends`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      const data = await response.json();
      setFriendships(data.data); 
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi lấy danh sách bạn bè.');
    }
  };

 
  const handleSearch = () => {
    const results = users.filter(
      (user) =>
        user.phone.includes(searchQuery) || user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

 
  const isFriend = (searchedUserId: string) => {
    return friendships.some(
      (friendship) =>
        (friendship.sender._id === userId && friendship.receiver._id === searchedUserId) ||
        (friendship.receiver._id === userId && friendship.sender._id === searchedUserId)
    );
  };

  const handleAddFriend = (userId: string) => {
    console.log(`Đã gửi lời mời kết bạn tới user ${userId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Thêm bạn</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Số điện thoại hoặc email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="mb-4 max-h-60 overflow-y-auto">
            {searchResults.map((user) => (
              <div key={user._id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <img
                    src={user.avatarUrl || '/path/to/default-avatar.png'}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span>{user.displayName}</span>
                </div>
                {isFriend(user._id) ? (
                  <button className="px-3 py-1 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed">
                    Đã là bạn bè
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(user._id)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Kết bạn
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
