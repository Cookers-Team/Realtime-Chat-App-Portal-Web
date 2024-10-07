import React, { useState, useEffect, useRef } from "react";
import { EmailPattern, remoteUrl } from "../types/constant";
import {
  X,
  Loader,
  Eye,
  CircleUserRoundIcon,
  MailIcon,
  CalendarIcon,
  InfoIcon,
  CameraIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import OtpPopup from "../components/Popup";
import InputField from "../components/InputField";
import useForm from "../hooks/useForm";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from "react-datetime-picker";
import { useNavigate } from "react-router-dom";
import { AlertDialog } from "../components/Dialog";
import useFetch from "../hooks/useFetch";
import { dateToString, stringToDate, uploadImage } from "../types/utils";

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ProfileFormData {
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  studentId: string;
  avatarUrl: string;
  birthDate?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isVisible,
  onClose,
}) => {
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.displayName)
      newErrors.displayName = "Tên hiển thị không được bỏ trống";
    if (!form.email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (!EmailPattern.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (showPasswordFields) {
      if (!form.currentPassword) {
        newErrors.currentPassword = "Mật khẩu hiện tại không được bỏ trống";
      }
      if (!form.newPassword) {
        newErrors.newPassword = "Mật khẩu mới không được bỏ trống";
      } else if (form.newPassword.length < 6) {
        newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
      }
      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không được bỏ trống";
      } else if (form.confirmPassword !== form.newPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp";
      }
    }

    return newErrors;
  };
  const { form, setForm, errors, setErrors, handleChange, isValidForm } =
    useForm(
      {
        displayName: "",
        bio: "",
        birthDate: "",
        avatarUrl: null,
        email: "",
        phone: "",
        roleId: null,
        currentPassword: null,
        newPassword: null,
        confirmPassword: null,
      },
      {},
      validate
    );
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [emailInitial, setEmailInitial] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { get, put, post } = useFetch();

  useEffect(() => {
    if (isVisible) {
      fetchCurrentProfile();
    }
  }, [isVisible]);

  const fetchCurrentProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${remoteUrl}/v1/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Không thể tải thông tin người dùng");
      const data = await response.json();
      setForm(data.data);
      setEmailInitial(data.data.email);
    } catch (error) {
      setError("Lỗi khi tải thông tin người dùng");
    }
  };

  const pickImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const onDateChange = (selectedDate: Date | null) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("birthDate", dateToString(selectedDate));
    }
  };

  const handleAlertAccept = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent | null) => {
    e?.preventDefault();
    if (isValidForm()) {
      setLoading(true);
      setError(null);

      if (form.birthDate) {
        form.birthDate = form.birthDate + " 07:00:00";
      }

      if (image) {
        form.avatarUrl = await uploadImage(image, post);
      }

      try {
        const token = localStorage.getItem("accessToken");
        let dataToSend = { ...form };

        if (showPasswordFields) {
          if (form.currentPassword && form.newPassword) {
            dataToSend = {
              ...dataToSend,
              currentPassword: form.currentPassword,
              newPassword: form.newPassword,
            };
          }
        }

        delete dataToSend.confirmPassword;
        console.log("data to send:", dataToSend);

        const response = await fetch(`${remoteUrl}/v1/user/update-profile`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.message);
        }

        if (form.email !== emailInitial) {
          setIsOtpPopupVisible(true);
          return;
        }
        setIsAlertVisible(true);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("Vui lòng kiểm tra lại thông tin");
    }
  };

  const handleConfirmOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${remoteUrl}/v1/user/confirm-email-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otpConfirmEmail: otpCode, email: form.email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      await handleSubmit(null);
      setIsOtpPopupVisible(false);
      setIsAlertVisible(true);
    } catch (error: any) {
      setError(error.message || "Lỗi khi xác nhận OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-11/12 md:w-[520px] p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Chỉnh sửa thông tin cá nhân
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <button
                type="button"
                onClick={pickImage}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 border-2 border-gray-300"
              >
                <CameraIcon size={30} color="royalblue" />
              </button>

              <div>
                {image || form.avatarUrl ? (
                  <img
                    src={image ? URL.createObjectURL(image) : form.avatarUrl}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/112"
                    alt="Placeholder"
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
                  />
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <InputField
            title="Tên hiển thị"
            isRequire={true}
            placeholder="Nhập tên hiển thị"
            onChangeText={(value: any) => handleChange("displayName", value)}
            value={form.displayName}
            icon={CircleUserRoundIcon}
            error={errors.displayName}
          />

          <InputField
            title="Email"
            isRequire={true}
            placeholder="Nhập địa chỉ email"
            onChangeText={(value: any) => handleChange("email", value)}
            keyboardType="email-address"
            value={form.email}
            icon={MailIcon}
            error={errors.email}
          />

          {/* <InputField
            title="Số điện thoại"
            isRequire={true}
            placeholder="Nhập số điện thoại"
            onChangeText={(value: any) => handleChange("phone", value)}
            keyboardType="numeric"
            value={form.phone}
            icon={PhoneIcon}
            error={errors.phone}
          /> */}

          {/* <InputField
            title="Ngày sinh"
            isRequire={false}
            placeholder="Chọn ngày sinh của bạn"
            onChangeText={(value: any) => handleChange("birthDate", value)}
            value={form.birthDate}
            icon={CalendarIcon}
            editable={false}
            onPress={() => {
              setShowDatePicker(true);
            }}
          /> */}

          <InputField
            title="Tiểu sử"
            isRequire={false}
            placeholder="Đôi nét về bạn"
            onChangeText={(value: any) => handleChange("bio", value)}
            value={form.bio}
            icon={InfoIcon}
            error={errors.bio}
          />

          {/* {showDatePicker && (
            <DateTimePicker
              value={stringToDate(form.birthDate) || new Date()}
              calendarIcon={null}
              onChange={(date) => onDateChange(date)}
              maxDate={new Date()}
            />
          )} */}

          <div className="mb-4 flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showPasswordFields}
                  onChange={() => setShowPasswordFields(!showPasswordFields)}
                />
                <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner"></div>
                <div
                  className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out transform ${
                    showPasswordFields ? "translate-x-5" : "translate-x-1"
                  } top-1`}
                ></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Đổi mật khẩu
              </span>
            </label>
          </div>

          {showPasswordFields && (
            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <InputField
                title="Mật khẩu hiện tại"
                isRequire={true}
                placeholder="Nhập mật khẩu hiện tại"
                onChangeText={(value: any) =>
                  handleChange("currentPassword", value)
                }
                value={form.currentPassword}
                icon={LockIcon}
                error={errors.currentPassword}
                secureTextEntry={true}
              />
              <InputField
                title="Mật khẩu mới"
                isRequire={true}
                placeholder="Nhập mật khẩu"
                onChangeText={(value: any) =>
                  handleChange("newPassword", value)
                }
                value={form.newPassword}
                icon={LockIcon}
                error={errors.newPassword}
                secureTextEntry={true}
              />
              <InputField
                title="Xác nhận mật khẩu"
                isRequire={true}
                placeholder="Nhập mật khẩu xác nhận"
                onChangeText={(value: any) =>
                  handleChange("confirmPassword", value)
                }
                value={form.confirmPassword}
                icon={ShieldCheckIcon}
                secureTextEntry={true}
                error={errors.confirmPassword}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
      {isOtpPopupVisible && (
        <OtpPopup
          onConfirm={handleConfirmOtp}
          onClose={() => setIsOtpPopupVisible(false)}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          error={error}
        />
      )}
      <AlertDialog
        isVisible={isAlertVisible}
        title="Thông báo"
        message="Thông tin cập nhật thành công. Bạn cần đăng nhập lại."
        color="green"
        onAccept={handleAlertAccept}
      />
    </div>
  );
};

export default EditProfileModal;
