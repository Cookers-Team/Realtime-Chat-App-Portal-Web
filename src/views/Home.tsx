import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { LoadingDialog } from "../components/Dialog";
import Profile from "../components/modal/ProfileModal";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import axios from "axios";
import useFetch from "../hooks/useFetch";
import { Conversation } from "../types/chat";
import FriendListItem from "../components/friend/FriendListItem";
import FriendsList from "../components/friend/FriendsList";
import GroupList from "../components/friend/GroupList";
import FriendRequests from "../components/friend/FriendRequests";
import PostListItem from "../components/post/PostListItem";
import MyPosts from "../components/post/MyPosts";
import FriendsPosts from "../components/post/FriendsPosts";
import CommunityPosts from "../components/post/CommunityPosts";

const Home = () => {
  const [selectedSection, setSelectedSection] = useState("messages");
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [selectedFriendSection, setSelectedFriendSection] = useState("friends");
  const [selectedPostSection, setSelectedPostSection] = useState("posts");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { get, post } = useFetch();

  useEffect(() => {
    if (selectedSection === "messages") {
      fetchConversations();
    }
  }, [selectedSection]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await get("/v1/conversation/list");
      const conversations = response.data.content;
      console.log("Conversations:", conversations);
      const filteredConversations = conversations.filter(
        (conversation: Conversation) =>
          conversation.lastMessage || conversation.kind === 1
      );
      setConversations(filteredConversations);

      console.log("Filtered conversations:", filteredConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen">
      <NavBar setSelectedSection={setSelectedSection} />

      <div className="w-1/4 bg-gray-200">
        {selectedSection === "messages" ? (
          <ChatList
            conversations={conversations}
            onSelectConversation={setSelectedConversation}
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
      <div className="w-3/4 bg-white">
        {selectedSection === "messages" ? (
          selectedConversation ? (
            <ChatWindow conversation={selectedConversation} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>Chọn một cuộc trò chuyện để bắt đầu</p>
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
          selectedPostSection === "myPosts" ? (
            <MyPosts />
          ) : selectedPostSection === "friendsPosts" ? (
            <FriendsPosts />
          ) : selectedPostSection === "communityPosts" ? (
            <CommunityPosts />
          ) : (
            <MyPosts />
          )
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
