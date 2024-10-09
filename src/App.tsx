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
