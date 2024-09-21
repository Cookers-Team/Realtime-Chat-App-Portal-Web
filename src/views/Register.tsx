import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { remoteUrl } from "../types/constant";
import { ToastContainer, toast } from "react-toastify";
import { LockIcon, MailIcon, PhoneIcon, ContactIcon } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    displayName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    displayName: "",
    email: "",
    phone: "",
    password: "",
  });

  const validate = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === "email" && !value.trim()) {
      newErrors.email = "Email không được bỏ trống";
    } else if (field === "email") {
      newErrors.email = "";
    }

    if (field === "password" && !value.trim()) {
      newErrors.password = "Mật khẩu không được bỏ trống";
    } else if (field === "password") {
      newErrors.password = "";
    }

    if (field === "displayName" && !value.trim()) {
      newErrors.displayName = "Tên hiển thị không được bỏ trống";
    } else if (field === "displayName") {
      newErrors.displayName = "";
    }

    if (field === "phone" && !value.trim()) {
      newErrors.phone = "Số điện thoại không được bỏ trống";
    } else if (field === "phone") {
      newErrors.phone = "";
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    validate(field, value);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(form).forEach((field) => {
      if (!form[field as keyof typeof form].trim()) {
        newErrors[field as keyof typeof errors] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } không được bỏ trống`;
        isValid = false;
      } else {
        newErrors[field as keyof typeof errors] = "";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch(`${remoteUrl}/v1/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      toast.success("Đăng ký thành công! Vui lòng xác thực OTP.");
      navigate(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
        <InputField
          title="Tên hiển thị"
          isRequire={true}
          placeholder="Nhập tên hiển thị"
          onChangeText={(value: any) => handleChange("displayName", value)}
          value={form.displayName}
          icon={ContactIcon}
          error={errors.displayName}
        />
        <InputField
          title="Email"
          isRequire={true}
          placeholder="Nhập địa chỉ email"
          onChangeText={(value: any) => handleChange("email", value)}
          value={form.email}
          icon={MailIcon}
          error={errors.email}
        />
        <InputField
          title="Số điện thoại"
          isRequire={true}
          placeholder="Nhập số điện thoại"
          onChangeText={(value: any) => handleChange("phone", value)}
          icon={PhoneIcon}
          value={form.phone}
          error={errors.phone}
        />
        <InputField
          title="Mật khẩu"
          isRequire={true}
          placeholder="Nhập mật khẩu"
          onChangeText={(value: any) => handleChange("password", value)}
          value={form.password}
          icon={LockIcon}
          secureTextEntry={true}
          error={errors.password}
        />
        <Button title="ĐĂNG KÝ" color="green" onPress={handleRegister} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
