import React, { useState, useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import { LoadingDialog } from "../components/Dialog";
import Profile from "../components/modal/ProfileModal";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import axios from "axios";
import useFetch from "../hooks/useFetch";
import { Conversation } from "../types/chat";

const Home = () => {
  const [selectedSection, setSelectedSection] = useState("messages");
  const [isProfileVisible, setProfileVisible] = useState(false);
  const [userCurrentId, setUserIdCurrent] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { get } = useFetch();

  const fetchUserId = useCallback(async () => {
    try {
      const response = await get("/v1/user/profile");
      setUserIdCurrent(response.data._id);
      console.log("User ID fetched in Home:", response.data._id);
    } catch (error) {
      console.error("Error getting user id:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

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
        {selectedSection === "messages" && (
          <ChatList
            conversations={conversations}
            onSelectConversation={setSelectedConversation}
          />
        )}
      </div>
      <div className="w-3/4 bg-white">
        {selectedSection === "messages" && selectedConversation && (
          <ChatWindow
            conversation={selectedConversation}
            userIdCurrent={userCurrentId}
          />
        )}
        {selectedSection === "posts" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Bài đăng</h2>
            <p>Hiển thị nội dung bài đăng tại đây...</p>
          </div>
        )}
        {selectedSection === "settings" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cài đặt</h2>
            <p>Hiển thị các cài đặt tại đây...</p>
          </div>
        )}
      </div>
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
};

export default Home;
