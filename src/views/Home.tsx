import Button from "../components/Button";
import ModalProfile from "../components/modal/ModalProfile";
import { useState } from "react";
import { useLoading } from "../hooks/useLoading";
import { remoteUrl } from "../types/constant";
import { toast } from "react-toastify";
import { LoadingDialog } from "../components/Dialog";
import { Profile } from "../models/profile/Profile";
import ModalUpdate from "../components/modal/ModalUpdate";

import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { isLoading, showLoading, hideLoading } = useLoading();

  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const showProfile = async () => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      const result = await response.json();
      const currentProfile: Profile = result.data;
      setProfile(currentProfile);
      setIsModalOpen(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      hideLoading();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeUpdate = () => {
    setIsModalUpdateOpen(false);
  }

  const showUpdate = async () => {
    setIsModalUpdateOpen(true);
  }

  const navigateToFriends = () => {
    navigate('/friends');
  const closeUpdate = async () => {
    setIsModalUpdateOpen(false);
    // Sau khi tắt ModalUpdate, load lại profile
    await showProfile();
  };
  const showUpdate = () => {
    setIsModalUpdateOpen(true);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">

        <h1 className="text-2xl mb-4">This is Home Page :3</h1>
        <div className="space-y-4">
          <Button title="Profile" color="royalblue" onPress={showProfile} />
          <Button title="Friends" color="green" onPress={navigateToFriends} />
        </div>
      
        {/* Gọi component <ModalProfile></ModalProfile> và truyền các props */}
        {profile && <ModalProfile isOpen={isModalOpen} profile={profile} onClose={closeModal} onUpdate={showUpdate}/>}
        {profile && <ModalUpdate isOpen={isModalUpdateOpen} profile={profile} onClose={closeUpdate} onUpdate={() => {}}/>}

        <h1 className="text-2xl">This is Home Page :3</h1>
        <Button title="Profile" color="royalblue" onPress={showProfile} />

        {/* Gọi component <ModalProfile></ModalProfile> và truyền các props */}
        {profile && (
          <ModalProfile
            isOpen={isModalOpen}
            profile={profile}
            onClose={closeModal}
            onUpdate={showUpdate}
          />
        )}
        {profile && (
          <ModalUpdate
            isOpen={isModalUpdateOpen}
            profile={profile}
            onClose={closeUpdate}
            onUpdate={() => {}}
          />
        )}
        <LoadingDialog isVisible={isLoading} />
      </div>
    </div>
  );
};


export default Home;

