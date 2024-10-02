import React, { useState, useEffect } from 'react';
import { useLoading } from '../../hooks/useLoading';
import { remoteUrl } from '../../types/constant';
import { toast } from "react-toastify";
import InputField from '../InputField';
import { Search, ChevronDown, ChevronUp } from 'lucide-react'; 
import { LoadingDialog } from '../Dialog';

interface Friend {
  _id: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

const FriendsList = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 

  const defaultAvatar = 'https://via.placeholder.com/150'; 

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/friendship/list`, {
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
      const formattedFriends = data.data.content
        .filter((friend: any) => friend.receiver !== null)
        .map((friend: any) => {
          const receiver = friend.receiver;
          return {
            _id: friend._id,
            displayName: receiver?.displayName || 'Unknown',
            email: receiver?.email || 'Email không có',
            avatarUrl: receiver?.avatarUrl || defaultAvatar, 
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
    .filter(friend =>
      friend.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.displayName || !b.displayName) return 0;
      if (sortOrder === 'asc') {
        return a.displayName.localeCompare(b.displayName);
      } else {
        return b.displayName.localeCompare(a.displayName);
      }
    });


  const groupedFriends: { [key: string]: Friend[] } = filteredFriends.reduce((acc, friend) => {
    const firstLetter = friend.displayName?.charAt(0).toUpperCase() || '#';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(friend);
    return acc;
  }, {} as { [key: string]: Friend[] });

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Bạn bè ({filteredFriends.length})</h2>
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
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
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
        Object.keys(groupedFriends).sort().map((letter) => (
          <div key={letter} className="mb-6">
            <h3 className="text-lg font-semibold">{letter}</h3>
            {groupedFriends[letter].map(friend => (
              <div key={friend._id} className="flex items-center mb-4">
                <img
                  src={friend.avatarUrl || defaultAvatar} 
                  alt={friend.displayName || 'Unknown'}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{friend.displayName || 'Unknown'}</p>
                  <p className="text-gray-500 text-sm">{friend.email || 'Email không có'}</p>
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
