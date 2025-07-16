import ChatContainer from "../components/ChatContainer";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import useAuthStore from "../store/authStore";
import { useState } from "react";

export default function HomePage() {
  const { user } = useAuthStore();
  const [isCloseSidebar, setIsCloseSidebar] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div>
      {user && (
        <Navbar
          isCloseSidebar={isCloseSidebar}
          setIsCloseSidebar={setIsCloseSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />
      )}
      <div
        className={`relative min-h-screen transition-all ease-in-out duration-300 bg-[rgb(32,32,32)] text-white ${
          user && (!isCloseSidebar ? "md:ml-[16%]" : "md:ml-[4%]")
        }`}
      >
        <Header
          isCloseSidebar={isCloseSidebar}
          toggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />
        <ChatContainer />
        <Footer />
      </div>
    </div>
  );
}
