import {
  AlignJustify,
  ChevronDown,
  CircleDashed,
  CircleQuestionMark,
  CircleUserRound,
  LifeBuoy,
  LogOut,
  Settings,
  Settings2,
  Sparkle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Header({
  isCloseSidebar,
  toggleMobileSidebar,
}: {
  isCloseSidebar: boolean;
  toggleMobileSidebar: () => void;
}) {
  const { user, logout } = useAuthStore();
  const [isOpenChatGPTOption, setIsOpenChatGPTOption] = useState(false);
  const [isOpenUserOption, setIsOpenUserOption] = useState(false);
  const navigate = useNavigate();

  return (
    <header
      className={`fixed top-0 right-0 flex items-center justify-between p-2 ${
        user
          ? isCloseSidebar
            ? "md:w-[96%] w-full"
            : "md:w-[84%] w-full"
          : "w-full"
      } z-50 min-h-[8vh] border-b border-gray-800 bg-[rgb(32,32,32)] transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center gap-2">
        <AlignJustify
          className="size-6 md:hidden block cursor-pointer text-white"
          onClick={toggleMobileSidebar}
        />
        <div
          className="relative flex items-center justify-center gap-1 hover:bg-[#2e2d2d] bg-transparent rounded-lg p-2 cursor-pointer"
          onClick={() => setIsOpenChatGPTOption(!isOpenChatGPTOption)}
        >
          <h1 className="text-white text-lg">ChatGPT</h1>
          <ChevronDown className="size-4 text-gray-300" />
          {isOpenChatGPTOption && (
            <div className="absolute top-12 left-0 bg-[#343433] rounded-3xl shadow-lg w-80">
              <img
                src="/7-colors.webp"
                className="w-full h-32 object-cover rounded-t-3xl"
              />
              <div className="p-4">
                <h2 className="text-white text-lg font-semibold">
                  Try advanced features for free
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Get smarter responses, upload files, create images, and more
                  by logging in
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    className="text-black text-sm font-medium bg-white rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => navigate("/log-in")}
                  >
                    Log in
                  </button>
                  <button
                    className="text-white border border-gray-500 text-sm font-medium bg-transparent rounded-full px-4 py-2 cursor-pointer hover:bg-gray-600"
                    onClick={() => navigate("/create-account")}
                  >
                    Sign up for free
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {user && (
        <div className="flex items-center gap-1 py-2 px-4 rounded-full bg-indigo-900 hover:bg-indigo-800 cursor-pointer">
          <Sparkle fill="white" className="size-4" />
          <span className="text-sm font-medium">Get Plus</span>
        </div>
      )}
      {user ? (
        <div className="flex items-center gap-3 relative">
          <div className="w-8 h-8 p-2 hover:bg-[#2e2d2d] rounded-full cursor-pointer">
            <CircleDashed className="w-full h-full" />
          </div>
          <div className="w-8 h-8 p-1 hover:bg-[#2e2d2d] rounded-full cursor-pointer">
            <img
              src={"/user.png"}
              alt="User Avatar"
              className="w-full h-full rounded-full cursor-pointer"
              onClick={() => setIsOpenUserOption(!isOpenUserOption)}
            />
          </div>
          {isOpenUserOption && (
            <div className="absolute top-10 right-0 bg-[#343433] rounded-2xl shadow-lg w-72 p-2">
              <div className="flex items-center gap-2 rounded-xl p-2 text-gray-400">
                <CircleUserRound className="size-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#2e2d2d] cursor-pointer">
                <Sparkles className="size-4" />
                <span className="text-sm">Upgrade plan</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#2e2d2d] cursor-pointer">
                <Settings2 className="size-4" />
                <span className="text-sm">Customize ChatGPT</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#2e2d2d] cursor-pointer">
                <Settings className="size-4" />
                <span className="text-sm">Settings</span>
              </div>
              <div className="px-2 py-3">
                <hr className="text-gray-500"></hr>
              </div>
              <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#2e2d2d] cursor-pointer">
                <LifeBuoy className="size-4" />
                <span className="text-sm">Help</span>
              </div>
              <div
                className="flex items-center gap-2 rounded-xl p-2 hover:bg-[#2e2d2d] cursor-pointer"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="size-4" />
                <span className="text-sm">Log out</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <button
            className="text-black text-sm font-medium bg-white rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200"
            onClick={() => navigate("/log-in")}
          >
            Log in
          </button>
          <button
            className="text-white border lg:block hidden border-gray-500 text-sm font-medium bg-transparent rounded-full px-4 py-2 cursor-pointer hover:bg-gray-600"
            onClick={() => navigate("/create-account")}
          >
            Sign up for free
          </button>
          <div className="p-1 rounded-full lg:block hidden hover:bg-gray-600 cursor-pointer">
            <CircleQuestionMark className="size-6 text-white" />
          </div>
        </div>
      )}
    </header>
  );
}
