import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { Message } from "../../types/chat";
import { ChatWindowProps } from "../../types/chat";

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const { get, post, del, put } = useFetch();
  const [userIdCurrent, setUserIdCurrent] = useState("");

  useEffect(() => {
    fetchMessages();
    fetchUserId();
  }, [conversation._id]);

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

  // Xử lý gửi tin nhắn
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

  // Xử lý xóa tin nhắn
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await del(`/v1/message/delete/${messageId}`);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Xử lý cập nhật tin nhắn
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

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-xl font-semibold">{conversation.name}</h2>
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
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  message.user._id === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p className="font-semibold">{message.user.displayName}</p>
                {/* Edit tin nhắn */}
                {editingMessageId === message._id ? (
                  <input
                    type="text"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                    className="w-full text-black p-2 border rounded-md"
                  />
                ) : (
                  <p>{message.content}</p>
                )}
                <p className="text-xs text-red-500">{message.createAt}</p>

                {/* Edit form */}
                {message.user._id === currentUserId && (
                  <div className="mt-2 flex space-x-2">
                    {editingMessageId === message._id ? (
                      <>
                        <button
                          onClick={() => handleUpdateMessage(message._id)}
                          className="px-2 py-1 bg-green-500 text-white rounded-md"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMessageId(null)}
                          className="px-2 py-1 bg-red-500 text-white rounded-md"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingMessageId(message._id);
                            setEditedMessage(message.content);
                          }}
                          className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded-md"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="w-full">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-5/6 p-2 border rounded-md"
          />
          <button
            type="submit"
            className="ml-12 w-30 mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
