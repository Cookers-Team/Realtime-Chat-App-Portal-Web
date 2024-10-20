import React, { useState, useEffect, useRef, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import {
  Message,
  Friends,
  ChatWindowProps,
  ConversationMembers,
} from "../../types/chat";
import UserIcon from "../../assets/user_icon.png";
import {
  MoreVertical,
  Edit,
  Trash,
  X,
  Check,
  UserPlus,
  Settings,
} from "lucide-react";
import { useLoading } from "../../hooks/useLoading";
import { toast } from "react-toastify";
import { AlertDialog, AlertErrorDialog, LoadingDialog } from "../Dialog";
import { set } from "react-datepicker/dist/date_utils";

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [friends, setFriends] = useState<Friends[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string | null>(null);
  const { get, post, del, put } = useFetch();
  const [userIdCurrent, setUserIdCurrent] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAlertErrorDialogOpen, setIsAlertErrorDialogOpen] = useState(false);
  const [conversationMembersIdList, setConversationMembersIdList] = useState<
    string[]
  >([]);
  const [isConversationMembers, setIsConversationMembers] = useState<
    ConversationMembers[]
  >([]);
  const [isMemberConversation, setIsMemberConversation] =
    useState<ConversationMembers>();

  const [isManageMembersModalOpen, setIsManageMembersModalOpen] =
    useState(false);
  const [conversationMembers, setConversationMembers] = useState<
    ConversationMembers[]
  >([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserId = useCallback(async () => {
    try {
      const response = await get("/v1/user/profile");
      setUserIdCurrent(response.data._id);
      console.log("Test useCallback getId");
    } catch (error) {
      console.error("Error getting user id:", error);
    }
  }, [get]);

  const fetchMessages = useCallback(async () => {
    if (!conversation._id) return;
    setIsLoadingMessages(true);
    try {
      const response = await get("/v1/message/list", {
        conversation: conversation._id,
      });
      setMessages(response.data.content);

      const membersResponse = await get(`/v1/conversation-member/list`, {
        conversation: conversation._id,
      });

      setIsConversationMembers(membersResponse.data.content);

      const memberIds = membersResponse.data.content.map(
        (member: any) => member.user._id
      );
      setConversationMembersIdList(memberIds);

      const member = membersResponse.data.content.find(
        (member: any) => member.user._id === userIdCurrent
      );
      setIsMemberConversation(member);
      console.log("Test useCallbacl fetchMessages");
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  }, [conversation._id, get, userIdCurrent]);

  const fetchMessagesAfterSend = useCallback(async () => {
    if (!conversation._id) return;
    try {
      const response = await get("/v1/message/list", {
        conversation: conversation._id,
      });
      setMessages(response.data.content);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [conversation._id, get, userIdCurrent]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateMemberPermissions = async (
    memberId: string,
    permissions: {
      canMessage: Number;
      canUpdate: Number;
      canAddMember: Number;
    }
  ) => {
    try {
      await put("/v1/conversation-member/update", {
        conversationMember: memberId,
        ...permissions,
      });

      setConversationMembers((prevMembers) =>
        prevMembers.map((member) =>
          member._id === memberId ? { ...member, ...permissions } : member
        )
      );

      toast.success("Quyền thành viên đã được cập nhật");
    } catch (error) {
      console.error("Error updating member permissions:", error);
      toast.error("Có lỗi xảy ra khi cập nhật quyền thành viên");
    }
  };
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsSendingMessage(true);
    try {
      await post("/v1/message/create", {
        conversation: conversation._id,
        content: newMessage,
      });
      setNewMessage("");
      fetchMessagesAfterSend();
    } catch (error) {
      console.error("Error creating message:", error);
    } finally {
      setIsSendingMessage(false);
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

  const fetchFriends = async () => {
    try {
      const response = await get("/v1/friendship/list", {
        getListKind: 0,
      });
      console.log("List ban be:", response.data.content);
      setFriends(response.data.content);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleAddMember = async () => {
    console.log("Selected friends:", selectedFriends);
    console.log("Conversation:", conversation._id);
    try {
      const response = await post("/v1/conversation-member/add", {
        conversation: conversation._id,
        user: selectedFriends,
      });
      console.log("Response add member:", response.result);
      if (!response.result) {
        setErrorMessage(
          response.message || "Có lỗi xảy ra khi thêm thành viên."
        );
        console.error("Error adding members:", response.message);
        setIsAddMemberModalOpen(false);
        setIsAlertErrorDialogOpen(true);
        return;
      }
      setIsAddMemberModalOpen(false);
      setIsAlertDialogOpen(true);
      setSelectedFriends(null);
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi thêm thành viên.");
      setIsAlertErrorDialogOpen(true);
      console.error("Error adding members:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="bg-white p-4 border-b shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={conversation.avatarUrl || UserIcon}
            alt="Avatar"
            className="rounded-full w-12 h-12 object-cover border-4 border-blue-100 shadow-lg"
          />
          <div>
            <h2 className="text-xl font-semibold">{conversation.name}</h2>
            {conversation.totalMembers > 1 && (
              <p className="text-sm text-gray-500">
                {conversation.totalMembers} thành viên
              </p>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          {conversation.kind === 1 && (
            <button
              onClick={() => {
                if (isMemberConversation?.canAddMember === 0) {
                  toast.error(
                    "Bạn không có quyền thêm thành viên vào cuộc trò chuyện này!"
                  );
                  return;
                } else {
                  setIsAddMemberModalOpen(true);
                  fetchFriends();
                }
              }}
              className={`p-2 rounded-full text-white transition-colors ${
                isMemberConversation?.canAddMember === 1
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={isMemberConversation?.canAddMember === 0}
            >
              <UserPlus size={20} />
            </button>
          )}
          {isMemberConversation?.isOwner === 1 && (
            <button
              onClick={() => setIsManageMembersModalOpen(true)}
              className="p-2 ml-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingMessages ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          messages
            .slice()
            .reverse()
            .map((message) => (
              <div
                key={message._id}
                className={`mb-4 flex ${
                  message.user._id === userIdCurrent
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="relative">
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      message.user._id === userIdCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black shadow"
                    }`}
                  >
                    {message.user._id !== userIdCurrent && (
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
                    <p className="text-xs mt-1 opacity-70">
                      {message.createdAt}
                    </p>
                  </div>
                  {message.user._id === userIdCurrent && (
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
            ))
        )}
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
            disabled={isSendingMessage}
          >
            {isSendingMessage ? "Sending..." : "Gửi"}
          </button>
        </div>
      </form>
      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Thêm thành viên</h3>
            <div className="max-h-60 overflow-y-auto">
              {friends.map((friend) => {
                const isAlreadyInConversation =
                  conversationMembersIdList.includes(friend.friend._id);

                return (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={friend._id}
                        name="selectedFriend"
                        checked={isAlreadyInConversation}
                        onChange={() =>
                          !isAlreadyInConversation &&
                          setSelectedFriends(friend.friend._id)
                        }
                        className="mr-2"
                        disabled={isAlreadyInConversation}
                      />
                      <label
                        htmlFor={friend._id}
                        className={
                          isAlreadyInConversation ? "text-gray-500" : ""
                        }
                      >
                        {friend.friend.displayName}
                      </label>
                    </div>

                    {isAlreadyInConversation && (
                      <p className="text-gray-500 ml-auto">Đã tham gia</p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {isManageMembersModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">
              Cho phép các thành viên trong nhóm:
            </h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="toggleUpdateAll"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  conversationMembers.forEach((member) => {
                    if (member.isOwner !== 1) {
                      handleUpdateMemberPermissions(member._id, {
                        ...member,
                        canUpdate: isChecked ? 1 : 0,
                      });
                    }
                  });
                }}
              />
              <label htmlFor="toggleUpdateAll" className="ml-2 text-sm">
                Thay đổi tên và ảnh đại diện nhóm
              </label>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="toggleUpdateAll"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  conversationMembers.forEach((member) => {
                    if (member.isOwner !== 1) {
                      handleUpdateMemberPermissions(member._id, {
                        ...member,
                        canMessage: isChecked ? 1 : 0,
                      });
                    }
                  });
                }}
              />
              <label htmlFor="toggleUpdateAll" className="ml-2 text-sm">
                Nhắn tin trong nhóm
              </label>
            </div>
            {/* <div className="max-h-60 overflow-y-auto">
              {conversationMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between mb-2"
                >
                  <span>{member.user.displayName}</span>
                  {member.isOwner !== 1 && (
                    <div className="flex space-x-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          member.canUpdate === 1
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {member.canUpdate === 1
                          ? "Có thể sửa"
                          : "Không thể sửa"}
                      </span>
                    </div>
                  )}
                  {member.isOwner === 1 && (
                    <span className="text-sm text-gray-500">Quản trị viên</span>
                  )}
                </div>
              ))}
            </div> */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsManageMembersModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* <LoadingDialog isVisible={isLoading} /> */}
      <AlertDialog
        isVisible={isAlertDialogOpen}
        title="Thành công"
        message="Bạn đã thêm thành viên thành công!"
        onAccept={() => {
          setIsAlertDialogOpen(false);
        }}
      />

      <AlertErrorDialog
        isVisible={isAlertErrorDialogOpen}
        title="Thất bại"
        message={errorMessage}
        onAccept={() => {
          setIsAlertErrorDialogOpen(false);
        }}
      />
    </div>
  );
};
export default ChatWindow;
