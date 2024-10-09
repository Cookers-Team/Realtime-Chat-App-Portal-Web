// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "./views/Login";
// import Register from "./views/Register";
// import ForgotPassword from "./views/ForgotPassword";
// import Home from "./views/Home";
// import Verify from "./views/Verify";
// import PostPage from "./views/PostPage";
// import Friend from "./views/Friend";
// import Chat from "./views/Chat";
// import PrivateRoute from "./components/PrivateRoute";
// import Profile from "./components/modal/ProfileModal";

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/verify" element={<Verify />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route
//           path="/home"
//           element={
//             <PrivateRoute>
//               <Home />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/friends"
//           element={
//             <PrivateRoute>
//               <Friend />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/chat"
//           element={
//             <PrivateRoute>
//               <Chat />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/postPage"
//           element={
//             <PrivateRoute>
//               <PostPage />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Loading from "./views/Loading";
import useFetch from "./hooks/useFetch";
import NotFound from "./views/NotFound";
import Home from "./views/Home";
import Friend from "./views/Friend";
import PostPage from "./views/PostPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { post, loading } = useFetch();

  useEffect(() => {
    const checkToken = async () => {
      const token = await localStorage.getItem("accessToken");
      const res = await post("/v1/user/verify-token", { accessToken: token });
      if (res.result) {
        setIsAuthenticated(true);
      } else {
        await localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
      }
    };
    checkToken();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <BrowserRouter>
            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/home" element={<Home />} />
                  <Route path="/friends" element={<Friend />} />
                  <Route path="/postPage" element={<PostPage />} />
                </>
              ) : (
                <>
                  <Route path="/login" element={<Login />} />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
};

export default App;
