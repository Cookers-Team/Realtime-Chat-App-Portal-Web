import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Image,
  Users,
  Settings,
  Send,
  Edit2,
  X,
  CircleUserRoundIcon,
  InfoIcon,
  CalendarIcon,
} from "lucide-react";
import useFetch from "../hooks/useFetch";
import UserIcon from "../assets/user_icon.png";
import InputField from "../components/InputField";
import useForm from "../hooks/useForm";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { formatBirthDate, formatDateFormToString } from "../utils/DateUtils";
import { toast } from "react-toastify";
import { remoteUrl } from "../types/constant";

const ChatInterface = () => {
  interface Contact {
    id: string;
    name: string;
    lastMessage: string;
    lastMessageTime: string;
    avatar: string;
  }

  const [contacts, setContacts] = useState<Contact[]>([]);
  interface Message {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  //   const [showDatePicker, setShowDatePicker] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  //   const { get, put, post, loading } = useFetch();
  const [currentUser, setCurrentUser] = useState({
    name: "Võ Hữu Tài",
    email: "votai@example.com",
    avatar: "/api/placeholder/100/100",
  });

  useEffect(() => {
    // Fetch contacts and messages from API
    const fetchData = async () => {
      // Replace this with data from API
      const contactsData = [
        {
          id: "1",
          name: "Tài",
          lastMessage: "Tài: Xin chào",
          lastMessageTime: "Hôm nay, 9:52",
          avatar: "/api/placeholder/40/40",
        },
        {
          id: "2",
          name: "Dũng",
          lastMessage: "Tài: Xin chào",
          lastMessageTime: "Hôm nay, 9:52",
          avatar: "/api/placeholder/40/40",
        },
      ];
      setContacts(contactsData);

      const messagesData = [
        {
          id: "1",
          sender: "Tài",
          content: "Hi bé, chiều nay làm khum?",
          timestamp: new Date("2023-09-27T10:01:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "1",
          sender: "Tài",
          content: "Hi bé, chiều nay làm khum?",
          timestamp: new Date("2023-09-27T10:01:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "1",
          sender: "Tài",
          content: "Hi bé, chiều nay làm khum?",
          timestamp: new Date("2023-09-27T10:01:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "1",
          sender: "Tài",
          content: "Hi bé, chiều nay làm khum?",
          timestamp: new Date("2023-09-27T10:01:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "1",
          sender: "Tài",
          content: "Hi bé, chiều nay làm khum?",
          timestamp: new Date("2023-09-27T10:01:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "1",
          sender: "Tài",
          content: "Hi bé, chiều nay làm khum?",
          timestamp: new Date("2023-09-27T10:01:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
        {
          id: "1",
          sender: "Tài",
          content: "Hi bé, chiều nay làm khum?",
          timestamp: new Date("2023-09-27T10:01:00"),
        },
        {
          id: "2",
          sender: "You",
          content: "Ok anh, bé rảnh nha",
          timestamp: new Date("2023-09-27T10:02:00"),
        },
      ];
      setMessages(messagesData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: Date.now().toString(),
        sender: "You",
        content: newMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
      // Send message to API
    }
  };

  // Dialog profile
  const ProfileModal = () => {
    if (!isProfileOpen) return null;
    const { get } = useFetch();
    const [profile, setProfile] = useState({
      displayName: "Đang tải",
      email: "Đang tải",
      phone: "Đang tải",
      birthDate: "Đang tải",
      bio: "Đang tải",
      avatarUrl: null,
    });
    const fetchData = async () => {
      const res = await get("/v1/user/profile");
      setProfile({
        ...res.data,
        birthDate: res.data.birthDate ? new Date(res.data.birthDate) : null,
      });
    };
    useEffect(() => {
      fetchData();
    }, []);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Hồ sơ cá nhân</h2>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <img
              src={profile.avatarUrl ? profile.avatarUrl : UserIcon}
              alt={profile.displayName}
              className="w-24 h-24 rounded-full"
            />
            <h3 className="text-lg font-semibold">{profile.displayName}</h3>
            <p className="text-gray-600">{profile.bio}</p>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-600">{profile.phone}</p>
            <p className="text-gray-600">{profile.birthDate}</p>
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Edit2 size={16} className="mr-2" /> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dialog edit profile

  const EditProfileModal = () => {
    if (!isEditProfileOpen) return null;
    const { get } = useFetch();
    const fetchData = async () => {
      const res = await get("/v1/user/profile");
      setForm({
        ...res.data,
        birthDate: res.data.birthDate ? new Date(res.data.birthDate) : null,
      });
    };
    useEffect(() => {
      fetchData();
    }, []);

    const validate = (form: any) => {
      const newErrors: any = {};
      if (!form.displayName)
        newErrors.displayName = "Tên hiển thị không được bỏ trống";
      return newErrors;
    };

    const { form, setForm, errors, handleChange, isValidForm } = useForm(
      {
        displayName: "",
        bio: "",
        birthDate: "",
        avatarUrl: "",
      },
      {
        displayName: "",
      },
      validate
    );

    // const onDateChange = (event: any, selectedDate: any) => {
    //   setShowDatePicker(false);
    //   if (selectedDate) {
    //     handleChange("birthDate", formatDateFormToString(selectedDate));
    //   }
    // };
    const handleSubmit = async () => {
      const { put } = useFetch();
      if (isValidForm()) {
        try {
          let updatedForm = { ...form };
          //   if (form.birthDate) {
          //     updatedForm.birthDate = form.birthDate + " 07:00:00";
          //   }
          //   if (image) {
          //     updatedForm.avatarUrl = await uploadImage(image, post);
          //   }
          const res = await put("/v1/user/update-profile", updatedForm);
          if (res.result) {
            // setIsEditProfileOpen(false);
            // setIsProfileOpen(false);
            // setCurrentUser({
            //   ...currentUser,
            //   name: form.displayName,
            //   avatar: form.avatarUrl || currentUser.avatar,
            // });
            console.log("Cập nhật thành công");
          } else {
            toast.error("Cập nhật thất bại");
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chỉnh sửa hồ sơ cá nhân</h2>
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col items-center gap-4">
            <img
              src={form.avatarUrl ? form.avatarUrl : UserIcon}
              alt={form.displayName}
              className="w-24 h-24 rounded-full"
            />
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
              title="Tiểu sử"
              isRequire={false}
              placeholder="Đôi nét về bạn"
              onChangeText={(value: any) => handleChange("bio", value)}
              value={form.bio}
              icon={InfoIcon}
            />

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
            />
            {showDatePicker && (
              <DateTimePicker
                value={formatBirthDate(form.birthDate) || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
                maximumDate={new Date()}
              />
            )} */}
            <button
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSubmit}
            >
              <Edit2 size={16} className="mr-2" /> Cập nhật
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex bg-gray-100">
      {/* Left sidebar */}
      <div className="w-16 bg-blue-500 flex flex-col items-center py-4">
        <div
          className="w-10 h-10 bg-white rounded-full mb-8 cursor-pointer"
          onClick={() => setIsProfileOpen(true)}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full rounded-full"
          />
        </div>
        <MessageSquare className="text-white mb-8" />
        <Image className="text-white mb-8" />
        <Users className="text-white mb-8" />
        <div className="flex-grow"></div>
        <Settings className="text-white" />
      </div>

      {/* Contact list */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div className="overflow-y-auto h-full">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => setCurrentContact(contact)}
            >
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-gray-500">{contact.lastMessage}</p>
              </div>
              <span className="ml-auto text-xs text-gray-400">
                {contact.lastMessageTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-grow flex flex-col">
        {currentContact ? (
          <>
            {/* Chat header */}
            <div className="bg-white p-4 flex items-center border-b">
              <img
                src={currentContact.avatar}
                alt={currentContact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h2 className="font-semibold">{currentContact.name}</h2>
                <p className="text-sm text-green-500">Trực tuyến</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "You" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === "You"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {message.content}
                    <div className="text-xs mt-1 text-gray-400">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="bg-white p-4 flex items-center">
              <input
                type="text"
                placeholder="Nhập nội dung ..."
                className="flex-grow p-2 border rounded-lg mr-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-lg"
              >
                <Send size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500">
            Chọn một cuộc trò chuyện để bắt đầu
          </div>
        )}
      </div>
      <ProfileModal />
      <EditProfileModal />
    </div>
  );
};

export default ChatInterface;
