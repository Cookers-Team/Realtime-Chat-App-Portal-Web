import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { remoteUrl } from "../types/constant";
import { ToastContainer, toast } from "react-toastify";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailFromParams = queryParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    } else {
      toast.error("Không tìm thấy email. Vui lòng đăng ký lại.");
      navigate("/register");
    }
  }, [location, navigate]);

  const handleVerify = async () => {
    try {
      const response = await fetch(`${remoteUrl}/v1/user/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }

      toast.success("Xác thực thành công! Hãy đăng nhập.", {
        onClose: () => {
          navigate("/");
        },
        autoClose: 2000,
      });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Xác thực OTP</h2>
        <InputField
          title="OTP"
          isRequire={true}
          placeholder="Nhập mã OTP"
          onChangeText={(value: any) => setOtp(value)}
          value={otp}
        />
        <Button title="XÁC THỰC" color="blue" onPress={handleVerify} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Verify;
