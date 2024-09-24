import React from "react";
import { Profile } from "../../models/profile/Profile";
import { User } from "lucide-react";
import Button from "../Button";

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  profile: Profile;
}

const ModalProfile: React.FC<ModalProfileProps> = ({ isOpen, onClose, profile, onUpdate}) => {
  if (!isOpen) return null;
  console.log(isOpen);
  console.log(profile);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
            <User size={48} className="text-gray-500" />
          </div>
        )}
        <p><strong>Display Name:</strong> {profile.displayName}</p>
        <p><strong>Email:</strong> {profile.email}</p>
      
        {profile.birthDate ? (
          <p><strong>Birth Date:</strong> {profile.birthDate}</p>
        ) : <p><strong>Birth Date:</strong> Chưa cập nhật</p>}
         {profile.birthDate ? (
          <p><strong>Birth Date:</strong> {profile.birthDate}</p>
        ) : <p><strong>Birth Date:</strong> Chưa cập nhật</p>}
        
        <Button title="Cập nhật" color="royalblue" onPress={onUpdate} />
        <Button title="Đóng" color="red" onPress={onClose} />
      </div>
    </div>
  );
};

export default ModalProfile;
