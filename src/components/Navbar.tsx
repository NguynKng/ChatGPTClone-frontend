import {
  Archive,
  CirclePlay,
  Ellipsis,
  Images,
  LayoutGrid,
  MoveLeft,
  PanelLeft,
  Pencil,
  Search,
  Sparkles,
  SquarePen,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useGetConversations } from "../hooks/useGetConversation";
import {
  deleteConversation,
  renameConversation,
} from "../services/api/conversationApi";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";
import type { Conversation } from "../types/Conversation";

export default function Navbar({
  isCloseSidebar,
  setIsCloseSidebar,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: {
  isCloseSidebar: boolean;
  setIsCloseSidebar: (isOpen: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}) {
  const { setConversations } = useAuthStore();
  const [modalDelete, setModalDelete] = useState({
    isOpen: false,
    conversationId: "",
  });
  const [modalRename, setModalRename] = useState({
    isOpen: false,
    conversationId: "",
    title: "",
  });
  const location = useLocation();
  const { conversations, loading: isLoadingConversations } =
    useGetConversations();
  const conversationId = location.pathname.split("/")[2];
  const navigate = useNavigate();
  const [isOpenConversationOptions, setIsOpenConversationOptions] = useState({
    isOpen: false,
    conversationId: "",
  });

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const response = await deleteConversation(conversationId);
      if (response.data.success) {
        setConversations(
          conversations.filter((c: Conversation) => c.id !== conversationId)
        );
        setModalDelete({ isOpen: false, conversationId: "" });
        toast.success("Conversation deleted successfully");
        navigate("/");
      } else {
        toast.error(response.data.message || "Failed to delete conversation");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete conversation";
      toast.error(errorMessage);
      console.error("Delete conversation error:", errorMessage);
    }
  };

  const handleRenameConversation = async (conversationId: string) => {
    try {
      const response = await renameConversation(
        conversationId,
        modalRename.title
      );
      if (response.data.success) {
        setConversations(
          conversations.map((c: Conversation) =>
            c.id === conversationId ? { ...c, title: modalRename.title } : c
          )
        );
        setModalRename({ isOpen: false, conversationId: "", title: "" });
        toast.success("Conversation renamed successfully");
      } else {
        toast.error(response.data.message || "Failed to rename conversation");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to rename conversation";
      toast.error(errorMessage);
      console.error("Rename conversation error:", errorMessage);
    }
  };

  return (
    <>
      {modalDelete.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 bg-[#2e2c2c] p-4 rounded-2xl shadow-lg w-[32rem]">
            <h2 className="text-lg text-white font-medium mb-4">
              Delete chat?
            </h2>
            <p className="text-white">
              This will delete{" "}
              <span className="font-semibold">Modal overlay fix.</span>
            </p>
            <p className="mt-1 text-gray-500">
              {`Visit`} <span className="underline">settings</span>{" "}
              {` to delete any memories saved during this chat.`}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="py-2 px-4 bg-transparent rounded-full text-white cursor-pointer hover:bg-gray-500 border border-gray-500"
                onClick={() =>
                  setModalDelete({ isOpen: false, conversationId: "" })
                }
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-red-600 text-white rounded-full cursor-pointer hover:bg-red-700"
                onClick={() => {
                  handleDeleteConversation(modalDelete.conversationId);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {modalRename.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 bg-[#2e2c2c] p-4 rounded-2xl shadow-lg w-[32rem]">
            <h2 className="text-lg text-white font-medium mb-4">
              Change conversation title?
            </h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleRenameConversation(modalRename.conversationId);
              }}
            >
              <input
                type="text"
                value={modalRename.title}
                onChange={(e) =>
                  setModalRename({
                    ...modalRename,
                    title: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none text-white"
                placeholder="Enter new title"
              />
              <div className="flex justify-end gap-2">
                <button
                  className="py-2 px-4 bg-transparent rounded-full text-white cursor-pointer hover:bg-gray-500 border border-gray-500"
                  onClick={() =>
                    setModalRename({
                      isOpen: false,
                      conversationId: "",
                      title: "",
                    })
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <nav
        className={`
            fixed left-0 top-0 h-screen
            bg-[rgb(24,24,24)]
            z-51 flex flex-col md:translate-x-0
            transition-all duration-300 ease-in-out
            ${isCloseSidebar ? "md:w-[4%]" : "md:w-[16%]"}
            ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            p-2
        `}
      >
        {/* === Header === */}
        <div
          className={`flex items-center ${
            isCloseSidebar ? "justify-center" : "justify-between"
          } mb-4`}
        >
          <div
            onClick={() => setIsCloseSidebar(!isCloseSidebar)}
            className="relative w-9 h-9 p-1 rounded-lg cursor-pointer group overflow-hidden hover:bg-[#2e2d2d]"
          >
            <img
              src="/chat-gpt.png"
              alt="Logo"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="relative w-9 h-9 p-2 rounded-lg md:hidden block group overflow-hidden cursor-w-resize hover:bg-[#2e2d2d]"
          >
            <MoveLeft className="w-full h-full text-gray-400" />
          </button>
          {!isCloseSidebar && (
            <button
              onClick={() => setIsCloseSidebar(!isCloseSidebar)}
              className="relative w-9 h-9 p-2 rounded-lg group overflow-hidden md:block hidden cursor-w-resize hover:bg-[#2e2d2d]"
            >
              <PanelLeft className="w-full h-full text-gray-400" />
            </button>
          )}
        </div>

        {/* === Actions === */}
        <div>
          {[
            { icon: SquarePen, label: "New chat", link: "/" },
            { icon: Search, label: "Search chats", link: "#" },
            { icon: Images, label: "Library", link: "#" },
          ].map(({ icon: Icon, label }) => (
            <div
              onClick={() => {
                if (label === "New chat") {
                  navigate("/");
                }
              }}
              key={label}
              className={`
                flex items-center gap-1 rounded-lg p-2
                hover:bg-[#2e2d2d] cursor-pointer text-white
                transition-all duration-300
                ${isCloseSidebar ? "justify-center" : ""}
                `}
            >
              <Icon className="size-4.5 shrink-0" />
              <span
                className={`
                    whitespace-nowrap overflow-hidden text-sm
                    transition-all duration-300 ease-in-out
                    ${
                      isCloseSidebar
                        ? "w-0 opacity-0 translate-x-[-8px]"
                        : "w-auto opacity-100 translate-x-0 ml-1"
                    }
                `}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* === Scrollable Chat List === */}
        {!isCloseSidebar && (
          <div className="flex-1 mt-5 overflow-y-auto custom-scroll">
            <div>
              {[
                { icon: CirclePlay, label: "Sora" },
                { icon: LayoutGrid, label: "GPTs" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className={`
                    flex items-center gap-1 rounded-lg p-2
                    hover:bg-[#2e2d2d] cursor-pointer text-white
                    transition-all duration-300
                    ${isCloseSidebar ? "justify-center" : ""}
                `}
                >
                  <Icon className="size-4.5 shrink-0" />
                  <span
                    className={`
                    whitespace-nowrap overflow-hidden text-sm
                    transition-all duration-300 ease-in-out
                    ${
                      isCloseSidebar
                        ? "w-0 opacity-0 translate-x-[-8px]"
                        : "w-auto opacity-100 translate-x-0 ml-1"
                    }
                    `}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h1
                className={`
                px-2 text-sm text-gray-500
                transition-all duration-300
                ${
                  isCloseSidebar
                    ? "opacity-0 translate-x-[-8px]"
                    : "opacity-100 translate-x-0"
                }
                `}
              >
                Chats
              </h1>
              <div className="mt-2">
                {isLoadingConversations ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-4 border-gray-400 border-t-white rounded-full animate-spin" />
                  </div>
                ) : (
                  conversations.map((chat) => (
                    <Link
                      to={`/c/${chat.id}`}
                      key={chat.id}
                      className={`
                    flex items-center justify-between gap-1 rounded-lg p-2
                    hover:bg-[#2e2d2d] cursor-pointer text-white group ${
                      conversationId === chat.id && "bg-[#2e2d2d]"
                    }
                    transition-all duration-300
                    ${isCloseSidebar ? "justify-center" : ""}
                    `}
                    >
                      <span
                        className={`
                        whitespace-nowrap overflow-hidden text-sm
                        transition-all duration-300 ease-in-out
                        ${
                          isCloseSidebar
                            ? "w-0 opacity-0 translate-x-[-8px]"
                            : "w-auto opacity-100 translate-x-0 ml-1"
                        }
                    `}
                      >
                        {chat.title}
                      </span>
                      <div
                        className="relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsOpenConversationOptions({
                            isOpen: !isOpenConversationOptions.isOpen,
                            conversationId: chat.id,
                          });
                        }}
                      >
                        <Ellipsis className="size-4 opacity-0 group-hover:opacity-100" />
                        {!isOpenConversationOptions.isOpen &&
                          isOpenConversationOptions.conversationId ===
                            chat.id && (
                            <div className="absolute top-full right-0 mt-2 w-32 rounded-xl z-[999] shadow-lg bg-[#302d2d] p-2">
                              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#423c3c]">
                                <Upload className="size-4.5" />
                                <span className="text-sm">Share</span>
                              </div>
                              <div
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgb(66,60,60)]"
                                onClick={() =>
                                  setModalRename({
                                    isOpen: true,
                                    conversationId: chat.id,
                                    title: chat.title,
                                  })
                                }
                              >
                                <Pencil className="size-4.5" />
                                <span className="text-sm">Rename</span>
                              </div>
                              <div className="p-2 w-full">
                                <hr className="text-gray-500"></hr>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#423c3c]">
                                <Archive className="size-4.5" />
                                <span className="text-sm">Share</span>
                              </div>
                              <div
                                className="flex items-center gap-2 text-red-600 p-2 rounded-lg hover:bg-red-900"
                                onClick={() =>
                                  setModalDelete({
                                    isOpen: true,
                                    conversationId: chat.id,
                                  })
                                }
                              >
                                <Trash2 className="size-4.5" />
                                <span className="text-sm">Delete</span>
                              </div>
                            </div>
                          )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* === Footer === */}
        {!isCloseSidebar && (
          <div
            className={`
            relative group flex items-center gap-2 py-2 px-4
            shrink-0 rounded-lg cursor-pointer overflow-hidden mt-2
            hover:bg-[#2e2d2d] transition-all duration-300
            ${isCloseSidebar ? "justify-center" : ""}
            `}
          >
            <Sparkles className="text-white size-4 shrink-0 z-10" />
            <div
              className={`
                z-10 overflow-hidden whitespace-nowrap
                transition-all duration-300 ease-in-out
                ${
                  isCloseSidebar
                    ? "w-0 opacity-0 translate-x-[-8px]"
                    : "w-auto opacity-100 translate-x-0 ml-1"
                }
            `}
            >
              <h3 className="text-sm text-gray-200">Upgrade plan</h3>
              <p className="text-xs text-gray-500">
                More access to the best model
              </p>
            </div>
            <div className="absolute inset-0 bg-gray-600 opacity-0 group-hover:opacity-60 transition duration-300" />
          </div>
        )}
      </nav>
    </>
  );
}
