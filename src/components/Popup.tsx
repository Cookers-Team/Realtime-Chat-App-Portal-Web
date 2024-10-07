import { X } from "lucide-react";

import { useState } from "react";

const OtpPopup = ({ onConfirm, onClose, otpCode, setOtpCode, error }: any) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-11/12 md:w-[400px] p-6 relative shadow-2xl">
        <button
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Nhập mã OTP
        </h2>

        <p className="text-gray-600 mb-4">
          Mã xác nhận đã được gửi đến địa chỉ email mới của bạn. Vui lòng nhập
          mã để tiếp tục.
        </p>

        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nhập mã OTP"
          value={otpCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOtpCode(e.target.value)
          }
        />
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
export default OtpPopup;
