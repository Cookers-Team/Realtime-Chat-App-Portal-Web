import { useState, useEffect } from "react";
import { ImageUpIcon } from "lucide-react";
import { toast } from "react-toastify";
import useForm from "../../hooks/useForm";
import useFetch from "../../hooks/useFetch";
import { uploadImage2 } from "../../types/utils"; // Giả sử đây là hàm upload ảnh
import TextareaField from "./TextareaField";
import CustomModal from "./CustomModal";
import UserImg from "../../assets/user_icon.png";

const UpdatePost = ({ isVisible, setVisible, postId, onButtonClick }: any) => {
  const [imagePreview, setImagePreview] = useState<any>(null);
  const [kind, setKind] = useState<number>(1); 
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Thêm imageUrls

  const validate = (form: any) => {
    const errors: any = {};
    if (!form.content.trim()) errors.content = "Nội dung không được bỏ trống";
    return errors;
  };

  const { form, errors, setForm, setErrors, handleChange, isValidForm } =
    useForm({ content: "", imageUrls: [], kind: 1 }, {}, validate);

  const { get, put, post, loading } = useFetch();

  useEffect(() => {
    const fetchData = async () => {
      if (postId) {
        setErrors({});
        setImagePreview(null);
        const res = await get(`/v1/post/get/${postId}`);
        setForm({ ...res.data });
        setKind(res.data.kind || 1);
        setImageUrls(res.data.imageUrls || []); 
      }
    };
    fetchData();
  }, [isVisible, postId]);

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result); 
          
          const uploadedImageUrl = await uploadImage2(file, post); 
          setImageUrls((prevUrls) => [...prevUrls, uploadedImageUrl]); 
        } else {
          console.error("Lỗi: reader.result không phải là chuỗi.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (isValidForm()) {
      const res = await put("/v1/post/update", { 
        id: postId, 
        content: form.content,
        imageUrls, 
        kind 
      });
      
      if (res.result) {
        toast.success("Cập nhật thành công");
        setVisible(false);
        onButtonClick();
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  if (!isVisible) return null;

  return (
    <CustomModal
      title="Chỉnh sửa bài đăng"
      onClose={() => setVisible(false)}
      bodyComponent={
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <img
                src={form.user?.avatarUrl || UserImg}
                className="w-12 h-12 rounded-full border-gray-300 border"
              />
              <div className="flex flex-col">
                <div className="flex space-x-2">
                  <p className="font-semibold">{form.user?.displayName}</p>
                  {
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {form.user?.role.name}
                    </span>
                  }
                </div>
                <p className="text-gray-500 text-sm">{form.createdAt}</p>
              </div>
            </div>

            {/* Dropdown cho lựa chọn "kind" */}
            <select
              value={kind}
              onChange={(e) => setKind(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none"
            >
              <option value={1}>Cộng đồng</option>
              <option value={2}>Bạn bè</option>
              <option value={3}>Chỉ mình tôi</option>
            </select>
          </div>
          
          <TextareaField
            title="Nội dung"
            isRequire
            placeholder="Nhập nội dung bài đăng"
            value={form.content}
            onChangeText={(value: any) => handleChange("content", value)}
            error={errors.content}
            multiline={true}
            rows={5}
            maxLength={1000}
            className="mb-4"
          />
          <div className="border border-gray-300 rounded-lg p-4 mb-4 relative hover:border-blue-500">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center">
              {imagePreview || imageUrls.length > 0 ? (
                <img
                  src={imagePreview || imageUrls[0]} // Hiển thị ảnh mới nhất
                  className="max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center">
                  <ImageUpIcon className="text-gray-400" size={20} />
                  <p className="ml-2 text-gray-400">Thêm hình ảnh</p>
                </div>
              )}
            </div>
          </div>
        </>
      }
      buttonText="LƯU"
      onButtonClick={handleUpdate}
      loading={loading}
    />
  );
};

export default UpdatePost;
