import Button from "../components/Button";
import ModalProfile from "../components/modal/ModalProfile";
import { useState } from "react";
import { useLoading } from "../hooks/useLoading";
import { remoteUrl } from "../types/constant";
import { toast } from "react-toastify";
import { LoadingDialog } from "../components/Dialog";
import { Profile } from "../models/profile/Profile";
import ModalUpdate from "../components/modal/ModalUpdate";



const Home = () => {
  
  const { isLoading, showLoading, hideLoading } = useLoading();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profileUpdate, setProfileUpdate] = useState<Profile | null>(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const showProfile = async () => {
    showLoading();
    try {
      const response = await fetch(`${remoteUrl}/v1/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      const result = await response.json();
      const currentProfile: Profile = result.data
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
  const showUpdate = () => {
    setIsModalUpdateOpen(true);
    console.log(isModalUpdateOpen);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl">This is Home Page :3</h1>
        <Button title="Profile" color="royalblue" onPress={showProfile} />
       
      
        {/* Gọi component <ModalProfile></ModalProfile> và truyền các props */}
        {profile && <ModalProfile isOpen={isModalOpen} profile={profile} onClose={closeModal} onUpdate={showUpdate}/>}
        {profile && <ModalUpdate isOpen={isModalUpdateOpen} profile={profile} onClose={closeUpdate} onUpdate={() => {}}/>}
        <LoadingDialog isVisible={isLoading} />
      </div>
    </div>
  );
};

export default Home;


