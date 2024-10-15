import React, { useState, useEffect, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import { Message } from "../../types/chat";
import { ChatWindowProps } from "../../types/chat";
import { MoreVertical, Edit, Trash, X, Check } from "lucide-react";

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { get, post, del, put } = useFetch();
  const [userIdCurrent, setUserIdCurrent] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchUserId();
  }, [conversation._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // console.log(
  //   "Message create value: ",
  //   messages.map((message) => message.createdAt)
  // );

  const currentUserId = userIdCurrent;

  const fetchUserId = async () => {
    try {
      const response = await get("/v1/user/profile");
      setUserIdCurrent(response.data._id);
    } catch (error) {
      console.error("Error getting user id:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await get("/v1/message/list", {
        conversation: conversation._id,
      });
      setMessages(response.data.content);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await post("/v1/message/create", {
        conversation: conversation._id,
        content: newMessage,
      });
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Error creating message:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await del(`/v1/message/delete/${messageId}`);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleUpdateMessage = async (messageId: string) => {
    try {
      await put("/v1/message/update", {
        id: messageId,
        content: editedMessage,
      });
      setEditingMessageId(null);
      fetchMessages();
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const toggleDropdown = (messageId: string) => {
    setActiveDropdown(activeDropdown === messageId ? null : messageId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="bg-white p-4 border-b shadow-sm flex items-center space-x-4">
        <img
          src={conversation.avatarUrl || "https://via.placeholder.com/112"}
          alt="Avatar"
          className="rounded-full w-12 h-12 object-cover border-4 border-blue-100 shadow-lg"
        />
        <div>
          <h2 className="text-xl font-semibold">{conversation.name}</h2>
          {conversation.totalMembers > 1 && (
            <p className="text-sm text-gray-500">
              {conversation.totalMembers - 1} thành viên
            </p>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages
          .slice()
          .reverse()
          .map((message) => (
            <div
              key={message._id}
              className={`mb-4 flex ${
                message.user._id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="relative">
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    message.user._id === currentUserId
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black shadow"
                  }`}
                >
                  {message.user._id !== currentUserId && (
                    <p className="font-semibold text-sm">
                      {message.user.displayName}
                    </p>
                  )}
                  {editingMessageId === message._id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        className="w-full text-black p-2 border rounded-md"
                      />
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X size={16} />
                      </button>

                      <button
                        onClick={() => handleUpdateMessage(message._id)}
                        className="px-2 py-1 bg-green-500 text-white rounded-md"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1">{message.content}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">{message.createdAt}</p>
                </div>
                {message.user._id === currentUserId && (
                  <div className="absolute top-0 right-0 -mt-1 -mr-1">
                    <button
                      onClick={() => toggleDropdown(message._id)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeDropdown === message._id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => {
                            setEditingMessageId(message._id);
                            setEditedMessage(message.content);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Edit size={16} className="mr-2" /> Chỉnh sửa
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteMessage(message._id);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <Trash size={16} className="mr-2" /> Xoá
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn tại đây..."
            className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;