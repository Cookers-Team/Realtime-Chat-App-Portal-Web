import React, { useState, useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import { LoadingDialog } from "../components/Dialog";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import WelcomeIcon from "../assets/welcome.png";
import useFetch from "../hooks/useFetch";
import { Conversation, UserProfile } from "../types/chat";
import FriendListItem from "../components/friend/FriendListItem";
import FriendsList from "../components/friend/FriendsList";
import GroupList from "../components/friend/GroupList";
import FriendRequests from "../components/friend/FriendRequests";
import PostListItem from "../components/post/PostListItem";
import MyPosts from "../components/post/MyPosts";
import FriendsPosts from "../components/post/FriendsPosts";
import CommunityPosts from "../components/post/CommunityPosts";
import useSocketChat from "../hooks/useSocketChat";
import { remoteUrl } from "../types/constant";
import { Menu, X } from "lucide-react";
import NotificationPanel from "../components/notification/NotificationPanel";

const Home = () => {
  const [selectedSection, setSelectedSection] = useState("messages");
  const [selectedFriendSection, setSelectedFriendSection] = useState("friends");
  const [selectedPostSection, setSelectedPostSection] = useState("posts");
  const [userCurrent, setUserCurrent] = useState<UserProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { get, post } = useFetch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleConversationUpdate = useCallback(
    async (updatedConversation: Conversation) => {
      console.log("Conversation updated in Home:", updatedConversation);
      const response = await get(
        `/v1/conversation/get/${updatedConversation._id}`
      );
      const updatedConversationObject = response.data;
      console.log("Updated conversation object:", updatedConversationObject);
      setSelectedConversation(updatedConversationObject);
    },
    []
  );

  const fetchUserCurrent = useCallback(async () => {
    try {
      const response = await get("/v1/user/profile");
      setUserCurrent(response.data);
      console.log("User ID fetched in Home:", response.data._id);
    } catch (error) {
      console.error("Error getting user id:", error);
    }
  }, [get]);

  const fetchConversations = useCallback(async () => {
    // if (selectedSection !== "messages" || !userCurrent) return;
    try {
      const response = await get("/v1/conversation/list");
      const conversations = response.data.content;
      console.log("Fetching conversations...", conversations);
      const filteredConversations = conversations.filter(
        (conversation: Conversation) =>
          conversation.lastMessage || conversation.kind === 1
      );
      setConversations(filteredConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [selectedSection, get, userCurrent]);

  useEffect(() => {
    fetchUserCurrent();
  }, [fetchUserCurrent]);

  useEffect(() => {
    if (selectedSection === "messages" && userCurrent) {
      fetchConversations();
    }
  }, [selectedSection, userCurrent, fetchConversations]);

  const handleMessageChange = useCallback(() => {
    if (selectedSection === "messages" && userCurrent) {
      console.log("Message changed, updating conversations...");
      fetchConversations();
    }
  }, [fetchConversations, selectedSection, userCurrent]);

  const handleNewMessageHome = useCallback(
    (messageId: string) => {
      console.log("New message received in Home:", messageId);
      handleMessageChange();
    },
    [handleMessageChange]
  );

  const handleUpdateMessageHome = useCallback(
    (messageId: string) => {
      console.log("Message updated in Home:", messageId);
      handleMessageChange();
    },
    [handleMessageChange]
  );

  const handleDeleteMessageHome = useCallback(
    (messageId: string) => {
      console.log("Message deleted in Home:", messageId);
      handleMessageChange();
    },
    [handleMessageChange]
  );

  const handleUpdateConversation = useCallback(() => {
    console.log("Conversation updated in Home");
    // handleMessageChange();
  }, []);
  useSocketChat({
    userId: userCurrent?._id,
    remoteUrl,
    onNewMessage: handleNewMessageHome,
    onUpdateMessage: handleUpdateMessageHome,
    onDeleteMessage: handleDeleteMessageHome,
    onConversationUpdate: handleMessageChange,
    onHandleUpdateConversation: handleUpdateConversation,
  });

  return (
    <div className="flex h-screen">
      <NavBar setSelectedSection={setSelectedSection} />

      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:relative
          w-3/4 lg:w-1/4
          h-full
          bg-gray-200
          transition-transform duration-300 ease-in-out
          z-40
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {selectedSection === "messages" ? (
          <ChatList
            conversations={conversations}
            onSelectConversation={(conversation) => {
              setSelectedConversation(conversation);
              setIsSidebarOpen(false);
            }}
            userCurrent={userCurrent}
          />
        ) : selectedSection === "friends" ? (
          <FriendListItem
            selectedFriendSection={selectedFriendSection}
            setSelectedFriendSection={setSelectedFriendSection}
          />
        ) : selectedSection === "posts" ? (
          <PostListItem
            selectedPostSection={selectedPostSection}
            setSelectedPostSection={setSelectedPostSection}
          />
        ) : null}
      </div>

      <div className="flex-1 bg-white">
        {selectedSection === "messages" ? (
          selectedConversation ? (
            <ChatWindow
              key={selectedConversation._id}
              conversation={selectedConversation}
              userCurrent={userCurrent}
              onMessageChange={handleMessageChange}
              onConversationUpdateInfo={handleConversationUpdate}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full space-y-4 bg-gray-100 p-6 rounded-lg shadow-lg">
              <p className="text-lg font-semibold text-gray-800">
                Chào mừng đến với{" "}
                <span className="text-blue-600">UTE Zalo</span>
              </p>
              <img
                src={WelcomeIcon}
                alt="Welcome icon"
                className="w-1/2 md:w-1/3 lg:w-1/4 rounded-full shadow-md"
              />
              <div className="text-gray-600 text-sm italic text-center">
                Chọn một cuộc trò chuyện để bắt đầu
              </div>
            </div>
          )
        ) : selectedSection === "friends" ? (
          selectedFriendSection === "friends" ? (
            <FriendsList />
          ) : selectedFriendSection === "groups" ? (
            <GroupList />
          ) : selectedFriendSection === "requests" ? (
            <FriendRequests />
          ) : (
            <FriendsList />
          )
        ) : selectedSection === "posts" ? (
          <div className="flex h-full">
            {/* Container cho hai phần bên trái */}
            <div className="flex-2 w-2/3 bg-white p-4">
              {selectedPostSection === "myPosts" ? (
                <MyPosts />
              ) : selectedPostSection === "friendsPosts" ? (
                <FriendsPosts />
              ) : selectedPostSection === "communityPosts" ? (
                <CommunityPosts />
              ) : (
                <MyPosts />
              )}
            </div>
            {/* Phần thông báo bên phải */}

            {/* Phần thông báo bên phải */}
            <div className="flex-1  bg-gray-100 p-4">
              <NotificationPanel />
            </div>
          </div>
        ) : selectedSection === "settings" ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cài đặt</h2>
            <p>Hiển thị các cài đặt tại đây...</p>
          </div>
        ) : null}
      </div>
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default Home;
