import { LockIcon, MailIcon } from "lucide-react";
import InputField from "../components/InputField";
import { useState } from "react";
import { useLoading } from "../hooks/useLoading";
import useForm from "../hooks/useForm";
import { ToastContainer, toast } from "react-toastify";
import { remoteUrl } from "../types/constant";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { LoadingDialog } from "../components/Dialog";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, showLoading, hideLoading } = useLoading();

  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.email.trim()) {
      newErrors.email = "Email không được bỏ trống";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được bỏ trống";
    }
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    { email: "", password: "" },
    { email: "", password: "" },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
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
        toast.success("Đăng nhập thành công");
        navigate("/home");
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        hideLoading();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
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

        <div className="text-sm">
          <a
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Quên mật khẩu?
          </a>
        </div>
        <Button title="ĐĂNG NHẬP" color="royalblue" onPress={handleSubmit} />
        <div className="text-sm mt-4 text-center">
          <span>Bạn chưa có tài khoản? </span>
          <a
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Đăng ký
          </a>
        </div>
      </div>

      <LoadingDialog isVisible={isLoading} />
      <ToastContainer />
    </div>
  );
};

export default Login;
