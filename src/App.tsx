import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyCodePage from "./pages/VerifyCodePage";
import { useEffect } from "react";
import useAuthStore from "./store/authStore";

function App() {
  const { loadUser } = useAuthStore();
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/c/:conversationId" element={<HomePage />} />
        <Route path="/create-account" element={<SignupPage />} />
        <Route path="/log-in" element={<LoginPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        {/* Add more routes as needed */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
