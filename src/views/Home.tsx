import React, { useState, useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import { LoadingDialog } from "../components/Dialog";
import Profile from "../components/modal/ProfileModal";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import axios from "axios";
import useFetch from "../hooks/useFetch";
import { Conversation, Friends, UserProfile } from "../types/chat";
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
  const [userCurrent, setUserCurrent] = useState<UserProfile | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [availableUsers, setAvailableUsers] = useState<Friends[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const { get, post } = useFetch();

  const fetchUserCurrent = useCallback(async () => {
    try {
      const response = await get("/v1/user/profile");
      setUserCurrent(response.data);
      console.log("User ID fetched in Home:", response.data._id);
    } catch (error) {
      console.error("Error getting user id:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserCurrent();
  }, [fetchUserCurrent]);

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

  const fetchAvailableUsers = async () => {
    try {
      const response = await get("/v1/user/list");
      setAvailableUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleCreateGroup = async (
    groupName: string,
    avatarUrl: string,
    members: string[]
  ) => {
    setIsLoading(true);
    try {
      const response = await post("/v1/conversation/create", {
        name: groupName,
        avatarUrl,
        conversationMembers: members,
      });
      const newGroup = response.data;
      setConversations((prevConversations) => [newGroup, ...prevConversations]);
    } catch (error) {
      console.error("Error creating group:", error);
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
            onCreateGroup={handleCreateGroup}
            availableUsers={availableUsers}
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
            <ChatWindow
              conversation={selectedConversation}
              userCurrent={userCurrent}
            />
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
