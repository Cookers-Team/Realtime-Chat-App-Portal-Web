import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import ForgotPassword from "./views/ForgotPassword";
import Home from "./views/Home";
import Verify from "./views/Verify";
import PostPage from "./views/PostPage";
import Friend from "./views/Friend";

import Chat from "./views/Chat";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/friends" element={<Friend />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/postPage" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
