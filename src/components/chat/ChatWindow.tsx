import React, { useState, useEffect, useRef, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import useSocketChat from "../../hooks/useSocketChat";
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
  Heart,
} from "lucide-react";
import { toast } from "react-toastify";
import { AlertDialog, AlertErrorDialog, LoadingDialog } from "../Dialog";
import { encrypt, decrypt } from "../../types/utils";
import { remoteUrl } from "../../types/constant";
import MessageSearch from "./MessageSearch";

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  userCurrent,
  onMessageChange,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [friends, setFriends] = useState<Friends[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string | null>(null);
  const { get, post, del, put, loading } = useFetch();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const scrollContainerRef = useRef<null | HTMLDivElement>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAlertErrorDialogOpen, setIsAlertErrorDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(0);
  const [isCanUpdate, setIsCanUpdate] = useState<Number>();
  const [isCanMessage, setIsCanMessage] = useState<Number>();
  const [isCanAddMember, setIsCanAddMember] = useState<Number>();
  const [conversationMembersIdList, setConversationMembersIdList] = useState<
    string[]
  >([]);
  const [isConversationMembers, setIsConversationMembers] = useState<
    ConversationMembers[]
  >([]);
  const [isManageMembersModalOpen, setIsManageMembersModalOpen] =
    useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const size = 20;
  const [isScrollToBottom, setIsScrollToBottom] = useState(false);

  const handleNewMessage = useCallback(
    async (messageId: string) => {
      try {
        const res = await get(`/v1/message/get/${messageId}`);
        const newMessage = res.data;
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
        setIsScrollToBottom(true);
        onMessageChange();
      } catch (error) {
        console.error("Error fetching new message:", error);
      }
    },
    [get, onMessageChange]
  );

  const handleUpdateMessageSocket = useCallback(
    async (messageId: string) => {
      console.log("Updating message socket:", messageId);
      try {
        const resMessage = await get(`/v1/message/get/${messageId}`);
        const updatedMessage = resMessage.data;

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
        onMessageChange();
      } catch (error) {
        console.error("Error fetching updated message and reactions:", error);
      }
    },
    [get, onMessageChange]
  );

  const handleDeleteMessageSocket = useCallback(
    (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg._id !== messageId)
      );
      onMessageChange();
    },
    [onMessageChange]
  );

  const handleUpdateConversationSocket = useCallback(
    async (conversationId: string) => {
      // console.log("Updating message socket:", messageId);
      try {
        const resMessage = await get(`/v1/conversation/get/${conversationId}`);
        setIsCanUpdate(resMessage.data.canUpdate);
        setIsCanMessage(resMessage.data.canMessage);
        setIsCanAddMember(resMessage.data.canAddMember);
        // onMessageChange();
      } catch (error) {
        console.error("Error fetching updated message and reactions:", error);
      }
    },
    [get]
  );

  useSocketChat({
    conversationId: conversation._id,
    userId: userCurrent?._id,
    remoteUrl,
    onNewMessage: handleNewMessage,
    onUpdateMessage: handleUpdateMessageSocket,
    onDeleteMessage: handleDeleteMessageSocket,
    onConversationUpdate: onMessageChange,
    onHandleUpdateConversation: handleUpdateConversationSocket,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    setIsScrollToBottom(false);
  }, [isScrollToBottom]);

  useEffect(() => {
    getOwner();
  }, [conversation]);

  const getOwner = () => {
    if (conversation.isOwner === 1) {
      setIsOwner(conversation.owner._id === userCurrent?._id ? 1 : 0);
    }
  };

  const fetchMessages = useCallback(
    async (pageNumber: number) => {
      if (!conversation._id) return;
      setIsLoadingMessages(true);

      try {
        setIsCanUpdate(conversation.canUpdate);
        setIsCanMessage(conversation.canMessage);
        setIsCanAddMember(conversation.canAddMember);

        const response = await get("/v1/message/list", {
          page: pageNumber,
          size,
          conversation: conversation._id,
        });

        console.log("Response messages:", response.data.content);
        const newMessages = response.data.content;
        if (pageNumber === 0) {
          setMessages([...newMessages]);
          setIsScrollToBottom(true);
        } else {
          setMessages((prev) => [...prev, ...newMessages]);
        }
        setHasMore(newMessages.length === size);
        setPage(pageNumber);

        const membersResponse = await get(`/v1/conversation-member/list`, {
          conversation: conversation._id,
        });

        setIsConversationMembers(membersResponse.data.content);
        setConversationMembersIdList(
          membersResponse.data.content.map((member: any) => member.user._id)
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [conversation._id, get, userCurrent?._id]
  );

  const handleScroll = async () => {
    if (
      scrollContainerRef.current &&
      scrollContainerRef.current.scrollTop === 0 &&
      !isLoadingMessages &&
      hasMore
    ) {
      const firstMessage = scrollContainerRef.current.firstElementChild;
      const previousScrollTop = scrollContainerRef.current.scrollTop;
      const previousOffsetTop = firstMessage
        ? (firstMessage as HTMLElement).offsetTop
        : 0;

      await fetchMessages(page + 1);

      if (firstMessage) {
        scrollContainerRef.current.scrollTop =
          (firstMessage as HTMLElement).offsetTop -
          previousOffsetTop +
          previousScrollTop;
      }
    }
  };

  useEffect(() => {
    fetchMessages(0);
  }, [fetchMessages]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsSendingMessage(true);
    try {
      const encryptedMessage = encrypt(
        newMessage.trim(),
        userCurrent?.secretKey
      );
      await post("/v1/message/create", {
        conversation: conversation._id,
        content: encryptedMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error creating message:", error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId: any) => {
    try {
      await del(`/v1/message/delete/${messageId}`);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleUpdateMessage = async (messageId: any) => {
    try {
      const encryptedMessage = encrypt(
        editedMessage.trim(),
        userCurrent?.secretKey
      );

      await put("/v1/message/update", {
        id: messageId,
        content: encryptedMessage,
      });
      setEditingMessageId(null);
      setEditedMessage("");
    } catch (error) {
      console.error("Error updating message:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tin nhắn");
    }
  };

  const handleReaction = async (messageId: any) => {
    try {
      if (messages.find((msg) => msg._id === messageId)?.isReacted === 1) {
        await del(`/v1/message-reaction/delete/${messageId}`);
      } else {
        await post("/v1/message-reaction/create", {
          message: messageId,
        });
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const toggleDropdown = (messageId: string) => {
    setActiveDropdown(activeDropdown === messageId ? null : messageId);
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

  const updateConversationPermission = async (
    id: string,
    permissions: {
      canMessage?: Number;
      canUpdate?: Number;
      canAddMember?: Number;
    }
  ) => {
    try {
      const responsePermission = await put("/v1/conversation/permission", {
        id: id,
        ...permissions,
      });
      console.log("Response permission:", responsePermission);
      if (permissions.canMessage !== undefined) {
        setIsCanMessage(permissions.canMessage);
      }
      if (permissions.canUpdate !== undefined) {
        setIsCanUpdate(permissions.canUpdate);
      }
      if (permissions.canAddMember !== undefined) {
        setIsCanAddMember(permissions.canAddMember);
      }
    } catch (error) {
      console.error("Error updating conversation permissions:", error);
      toast.error("Có lỗi xảy ra khi cập nhật quyền cuộc trò chuyện");
    }
  };
  console.log("Test Owner:", isOwner);
  console.log("Test permission:", isCanUpdate, isCanMessage, isCanAddMember);

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
          <MessageSearch
            conversation={conversation}
            userCurrent={userCurrent}
            onMessageSelect={async (messageId: any) => {
              console.log("Message selected:", messageId);

              let messageElement: HTMLElement | null =
                document.getElementById(messageId);
              if (messageElement) {
                messageElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                messageElement.classList.add("bg-blue-100");
                setTimeout(() => {
                  messageElement?.classList.remove("bg-blue-100");
                }, 2000);
              } else {
                let page = 0;
                let messageFound = false;

                while (!messageFound) {
                  await fetchMessages(page);
                  messageElement = document.getElementById(messageId);
                  if (messageElement) {
                    messageFound = true;
                    messageElement.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    messageElement.classList.add("bg-blue-100");
                    setTimeout(() => {
                      messageElement?.classList.remove("bg-blue-100");
                    }, 5000);
                  } else {
                    page++;
                  }
                }
              }
            }}
          />

          {conversation.kind === 1 && (
            <button
              onClick={() => {
                if (isCanAddMember === 1 || isOwner === 1) {
                  setIsAddMemberModalOpen(true);
                  fetchFriends();
                } else {
                  toast.error(
                    "Bạn không có quyền thêm thành viên vào cuộc trò chuyện này!"
                  );
                  return;
                }
              }}
              className={`p-2 rounded-full text-white transition-colors ${
                isCanAddMember === 1 || isOwner === 1
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={isCanAddMember === 0 && isOwner === 0}
            >
              <UserPlus size={20} />
            </button>
          )}
          {isOwner === 1 && conversation.kind === 1 && (
            <button
              onClick={() => setIsManageMembersModalOpen(true)}
              className="p-2 ml-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>
      <div
        className="flex-1 overflow-y-auto p-4"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {isLoadingMessages && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {messages
          .slice()
          .reverse()
          .map((message) => (
            <div
              id={message._id}
              key={message._id}
              className={`mb-4 flex ${
                message.user._id === userCurrent?._id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className="relative">
                <div
                  className={`p-3 rounded-lg max-w-xs break-all ${
                    message.user._id === userCurrent?._id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-black shadow"
                  } relative`}
                >
                  {message.user._id !== userCurrent?._id && (
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
                    <p className="mt-1">
                      {message.content
                        ? decrypt(message.content, userCurrent?.secretKey)
                        : "Không thể hiển thị tin nhắn"}
                    </p>
                  )}
                  <p className="text-xs mt-1 opacity-70">{message.createdAt}</p>

                  <div className="absolute -bottom-2 -right-2">
                    <button
                      onClick={() => handleReaction(message._id)}
                      className="flex items-center space-x-1 bg-gray-50 shadow-md rounded-full p-2 hover:bg-gray-300 transition-colors"
                    >
                      <Heart
                        size={14}
                        className={
                          message.isReacted == 1
                            ? "text-red-500"
                            : "text-gray-500"
                        }
                      />
                      {message.totalReactions > 0 && (
                        <span className="text-xs text-gray-500">
                          {message.totalReactions}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                {message.user._id === userCurrent?._id && (
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
                            setEditedMessage(
                              decrypt(message.content, userCurrent.secretKey)
                            );
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

      {isCanMessage === 1 || isOwner || conversation.kind == 2 ? (
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
      ) : (
        <div className="p-4 bg-gray-100 border-t text-gray-600 text-center">
          Bạn không có quyền gửi tin nhắn trong nhóm này.
        </div>
      )}

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
                checked={isCanUpdate === 1}
                onChange={(e) => {
                  updateConversationPermission(conversation._id, {
                    canUpdate: e.target.checked ? 1 : 0,
                  });
                }}
              />
              <label htmlFor="toggleUpdateAll" className="ml-2">
                Có thể cập nhật tên và avatar của nhóm
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="toggleMessageAll"
                checked={isCanMessage === 1}
                onChange={(e) => {
                  updateConversationPermission(conversation._id, {
                    canMessage: e.target.checked ? 1 : 0,
                  });
                }}
              />
              <label htmlFor="toggleMessageAll" className="ml-2">
                Có thể nhắn tin trong nhóm
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="toggleAddMemberAll"
                checked={isCanAddMember === 1}
                onChange={(e) => {
                  updateConversationPermission(conversation._id, {
                    canAddMember: e.target.checked ? 1 : 0,
                  });
                }}
              />
              <label htmlFor="toggleAddMemberAll" className="ml-2">
                Có thể thêm thành viên vào nhóm
              </label>
            </div>
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
