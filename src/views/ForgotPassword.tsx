import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { remoteUrl } from "../types/constant";
import { ToastContainer, toast } from "react-toastify";
import { MailIcon, LockIcon } from "lucide-react";
import { useLoading } from "../hooks/useLoading"; 
import { LoadingDialog } from "../components/Dialog"; 

type FormFields = {
  email: string;
  otp: string;
  newPassword: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormFields>({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormFields>({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoading(); 

  const validate = (field: keyof FormFields, value: string) => {
    const newErrors = { ...errors };
    if (field === "email" && !value.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (field === "otp" && !value.trim()) {
      newErrors.otp = "OTP không được bỏ trống";
    } else if (field === "newPassword" && !value.trim()) {
      newErrors.newPassword = "Mật khẩu mới không được bỏ trống";
    } else {
      newErrors[field] = "";
    }
    setErrors(newErrors);
  };

  const handleChange = (field: keyof FormFields, value: string) => {
    setForm({ ...form, [field]: value });
    validate(field, value);
  };

  const handleSubmitEmail = async () => {
    if (!form.email.trim()) {
      toast.error("Vui lòng nhập địa chỉ email");
      return;
    }

    showLoading(); 
    try {
      const response = await fetch(`${remoteUrl}/v1/user/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      toast.success("OTP đã được gửi đến email của bạn");
      setStep(2);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      hideLoading(); 
    }
  };

  const handleResetPassword = async () => {
    if (!form.otp.trim() || !form.newPassword.trim()) {
      toast.error("Vui lòng nhập OTP và mật khẩu mới");
      return;
    }

    showLoading(); 
    try {
      const response = await fetch(`${remoteUrl}/v1/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          newPassword: form.newPassword,
          otp: form.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Có lỗi xảy ra khi đặt lại mật khẩu.");
        return;
      }

      toast.success("Mật khẩu đã được đặt lại thành công");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      hideLoading(); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>
        {step === 1 && (
          <>
            <InputField
              title="Email"
              isRequire={true}
              placeholder="Nhập địa chỉ email"
              onChangeText={(value: string) => handleChange("email", value)}
              value={form.email}
              icon={MailIcon}
              error={errors.email}
            />
            <Button title="Gửi OTP" color="blue" onPress={handleSubmitEmail} />
          </>
        )}
        {step === 2 && (
          <>
            <InputField
              title="OTP"
              isRequire={true}
              placeholder="Nhập mã OTP"
              onChangeText={(value: string) => handleChange("otp", value)}
              value={form.otp}
              error={errors.otp}
            />
            <InputField
              title="Mật khẩu mới"
              isRequire={true}
              placeholder="Nhập mật khẩu mới"
              onChangeText={(value: string) => handleChange("newPassword", value)}
              value={form.newPassword}
              icon={LockIcon}
              secureTextEntry={!showNewPassword}
              togglePassword={() => setShowNewPassword(!showNewPassword)}
              showPassword={showNewPassword}
              error={errors.newPassword}
            />
            <Button title="Đặt lại mật khẩu" color="green" onPress={handleResetPassword} />
          </>
        )}
      </div>
      <LoadingDialog isVisible={isLoading} /> {/* Hiển thị hộp thoại loading */}
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
