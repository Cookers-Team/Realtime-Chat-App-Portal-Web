import { LockIcon, MailIcon } from "lucide-react";
import InputField from "../components/InputField";
import { useState } from "react";
import { useLoading } from "../hooks/useLoading";
import useForm from "../hooks/useForm";
import { ToastContainer, toast } from "react-toastify";
import { EmailPattern, remoteUrl } from "../types/constant";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { LoadingDialog } from "../components/Dialog";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoading();

  const [form, setForm] = useState({
    email: "",

    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const validate = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === "email") {
      if (!value.trim()) {
        newErrors.email = "Email không được bỏ trống";
      } else if (!EmailPattern.test(value)) {
        newErrors.email = "Email không hợp lệ";
      } else {
        newErrors.email = "";
      }
    }
    if (field === "password") {
      if (!value.trim()) {
        newErrors.password = "Mật khẩu không được bỏ trống";
      } else if (value.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      } else {
        newErrors.password = "";
      }
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    } else {
      showLoading();
      try {
        const response = await fetch(`${remoteUrl}/v1/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message);
          return;
        }
        const data = await response.json();
        await localStorage.setItem("accessToken", data.data.accessToken);
        navigate("/chat");
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        hideLoading();
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-blue-500">
      <div className="w-1/3 flex items-center justify-center p-8">
        <div className="text-white">
          <img
            src="/src/assets/ute_logo.png"
            alt="UTE Zalo logo"
            className="w-full md:w-1/4 lg:w-1/6 mb-4"
          />
          <h1 className="text-4xl font-bold mb-4">UTE Zalo</h1>
          <img
            src="/src/assets/login-page.png"
            alt="Illustration"
            className="mb-4"
          />
        </div>
      </div>
      <div className="w-2/3 bg-white flex items-center justify-center p-8 rounded-s-3xl">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-center mb-6">Đăng nhập</h2>
          <InputField
            title="Email đăng nhập"
            isRequire={true}
            placeholder="Nhập địa chỉ email"
            onChangeText={(value: any) => handleChange("email", value)}
            value={form.email}
            icon={MailIcon}
            error={errors.email}
          />
          <InputField
            title="Mật khẩu"
            isRequire={true}
            placeholder="Nhập mật khẩu"
            onChangeText={(value: any) => handleChange("password", value)}
            value={form.password}
            icon={LockIcon}
            secureTextEntry={!showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
            showPassword={showPassword}
            error={errors.password}
          />
          <div className="text-sm text-right">
            <a
              href="/forgot-password"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Quên mật khẩu?
            </a>
          </div>

          <Button title="Đăng nhập" color="royalblue" onPress={handleSubmit} />
          <p className="mt-4 text-center">
            Bạn chưa có tài khoản?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
      <LoadingDialog isVisible={isLoading} />
      <ToastContainer />
    </div>
  );
};

export default Login;
