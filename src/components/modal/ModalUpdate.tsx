import React from "react";
import { Profile } from "../../models/profile/Profile";
import { ArrowLeft, CalendarIcon, KeyIcon, PenIcon, User, UserIcon } from "lucide-react";
import Button from "../Button";
import InputField from "../InputField";
import useForm from "../../hooks/useForm";

interface ModalUpdate {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  profile: Profile;
}

const ModalUpdate: React.FC<ModalUpdate> = ({ isOpen, onClose, profile, onUpdate}) => {
  if (!isOpen) return null;
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.disPlayName.trim()) {
      newErrors.disPlayName = "Tên đăng nhập không được bỏ trống";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được bỏ trống";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { displayName: "", birthDate:"", bio:"", avatarUrl:"", password:""},
    { displayName: "", birthDate:"", bio:"", avatarUrl:"",password:""},
    validate 
  );
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
      
      <div className="flex items-center mb-5">
          <ArrowLeft
            size={24}
            className="cursor-pointer"
            onClick={onClose}
          />
          <h2 className="text-xl font-semibold ms-5">
            Cập nhật thông tin cá nhân
          </h2>
      </div>
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
        
         <InputField
          title="Tên Đăng nhập"
          isRequire={true}
          placeholder="Nhập tên đăng nhập"
          onChangeText={(value: any) => handleChange("displayName", value)}
          value={form.disPlayName}
          icon={UserIcon}
          error={errors.email}
        />
        <InputField
          title="Giới thiệu"
          isRequire={false}
          placeholder="Nhập giới thiệu"
          onChangeText={(value: any) => handleChange("bio", value)}
          value={form.bio}
          icon={PenIcon}
          error={undefined}
        />
        <div className="mb-4">
          <label className="text-base font-semibold text-gray-800 mb-2 block text-left">
            Ngày sinh
          
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              className="pl-10 w-full p-2 border rounded-md"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>
          {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate}</p>}
        </div>
    
        <InputField
          title="Mật khẩu"
          isRequire={true}
          placeholder="Nhập mật khẩu"
          onChangeText={(value: any) => handleChange("password", value)}
          value={form.bio}
          icon={KeyIcon}
          error={undefined}
        />

        <Button title="Cập nhật" color="royalblue" onPress={onUpdate} />
        
      </div>
    </div>
  );
};

export default ModalUpdate;
