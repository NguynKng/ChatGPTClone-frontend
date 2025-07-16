import {
  ArrowUp,
  AudioLines,
  Eye,
  Globe,
  Mic,
  Paperclip,
  PencilLine,
  Plus,
  Settings2,
  SquareChartGantt,
  SquareTerminal,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMessagesByConversationId,
  sendPromptToConversation,
  startNewChat,
  generateContent,
} from "../services/api/conversationApi";
import type { Message } from "../types/Message";
import useAuthStore from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

export default function ChatContainer() {
  const navigate = useNavigate();
  const { user, addConversation } = useAuthStore();
  const { conversationId } = useParams();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (conversationId) {
        setIsLoadingConversation(true);
        try {
          const response = await getMessagesByConversationId(conversationId);
          if (response.data.success) {
            setMessages(response.data.data);
          } else {
            console.error("Failed to fetch messages:", response);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoadingConversation(false);
        }
      } else {
        setMessages([]);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Make a local copy of the user message immediately
    const userMessage: Message = {
      id: crypto.randomUUID(),
      conversationId: conversationId || "",
      content: prompt,
      isUserMessage: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setPrompt(""); // clear input right away

    setIsLoadingResponse(true);
    try {
      if (user) {
        if (!conversationId) {
          // Call API with the prompt
          const response = await startNewChat(prompt, prompt.slice(0, 20));
          if (response.data.success && response.data.data?.length > 0) {
            addConversation(response.data.data[2]);
            const assistantMessage = response.data.data.find(
              (m: Message) => !m.isUserMessage
            );
            if (assistantMessage) {
              setMessages((prevMessages) => [
                ...prevMessages,
                assistantMessage,
              ]);
            }
            // 2️⃣ Navigate to new conversation ID if different
            const newConversationId = response.data.data[0]?.conversationId;
            if (newConversationId && newConversationId !== conversationId) {
              navigate(`/c/${newConversationId}`);
            }
          } else {
            console.error("Failed to get assistant reply:", response);
          }
        } else {
          // If conversationId exists, send the prompt to the existing conversation
          const response = await sendPromptToConversation(
            conversationId,
            prompt
          );
          if (response.data.success && response.data.data?.length > 0) {
            const assistantMessage = response.data.data.find(
              (m: Message) => !m.isUserMessage
            );
            if (assistantMessage) {
              setMessages((prevMessages) => [
                ...prevMessages,
                assistantMessage,
              ]);
            }
          } else {
            console.error("Failed to get assistant reply:", response);
          }
        }
      } else {
        const response = await generateContent(prompt);
        if (response.data.success && response.data.data) {
          const aiMessage: Message = {
            id: crypto.randomUUID(),
            conversationId: "",
            content: response.data.data,
            isUserMessage: false,
            createdAt: new Date().toISOString(),
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
      }
    } catch (error) {
      console.error("Error sending prompt:", error);
    } finally {
      setIsLoadingResponse(false);
    }
  }, [
    prompt,
    setMessages,
    setPrompt,
    setIsLoadingResponse,
    conversationId,
    navigate,
    addConversation,
    user,
  ]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className={`w-full min-h-[96vh] pt-[8vh] px-4 ${
        user ? "lg:px-[20%] " : "md:px-[25%]"
      }`}
    >
      <div className="relative flex flex-col h-[calc(100vh-12vh)] overflow-hidden rounded-lg">
        <div className="flex-1 overflow-y-auto hide-scrollbar pt-8 pb-[15%]">
          <div className="flex flex-col gap-4">
            {isLoadingConversation ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-gray-400 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              messages.map((message) => {
                return (
                  <div
                    key={message.id}
                    className={`p-4 rounded-xl ${
                      message.isUserMessage
                        ? "text-white bg-[#333231] max-w-lg self-end"
                        : "w-full"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                );
              })
            )}
            {isLoadingResponse &&
              messages.length > 0 &&
              messages[messages.length - 1].isUserMessage && (
                <div className="flex items-center gap-2 p-4 rounded-xl w-full bg-transparent">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
                  <p className="text-gray-400">AI is thinking...</p>
                </div>
              )}
            <div ref={bottomRef} /> {/* 👈 Add this */}
          </div>
        </div>
        <div
          className={`absolute w-full transition-transform ease-in-out bottom-0 duration-300 ${
            messages.length > 0 ? "translate-y-0" : "translate-y-[-30vh] lg:translate-y-[-40vh]"
          }`}
        >
          {messages.length === 0 && (
            <h1 className="text-white text-3xl text-center mb-8">ChatGPT</h1>
          )}
          <form onSubmit={handleSend} className="rounded-3xl bg-[#333230] p-1 w-full">
            <input
              type="text"
              placeholder="Ask anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 bg-transparent text-white placeholder-gray-400 outline-none"
            />
            {user ? (
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-1">
                  <button className="flex items-center justify-center gap-1 text-white bg-transparent p-2 rounded-full hover:bg-[#555453] cursor-pointer">
                    <Plus className="size-4.5" />
                  </button>
                  <button className="flex items-center justify-center gap-1 text-white bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                    <Settings2 className="size-4.5" />
                    <h3 className="text-sm">Tools</h3>
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button className="flex items-center justify-center gap-1 text-white bg-transparent p-2 rounded-full hover:bg-[#555453] cursor-pointer">
                    <Mic className="size-4.5" />
                  </button>
                  {prompt ? (
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-1 text-white p-2 rounded-full hover:bg-gray-300 cursor-pointer bg-white"
                    >
                      <ArrowUp className="size-4.5 text-black" />
                    </button>
                  ) : (
                    <button className="flex items-center justify-center gap-1 text-white p-2 rounded-full hover:bg-[#555453] cursor-pointer bg-[#636260]">
                      <AudioLines className="size-4.5" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center gap-1 text-white border border-gray-500  bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                    <Paperclip className="size-4" />
                    <h3 className="text-sm">Attach</h3>
                  </button>
                  <button className="flex items-center justify-center gap-1 text-white border border-gray-500  bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                    <Globe className="size-4" />
                    <h3 className="text-sm">Search</h3>
                  </button>
                </div>
                {prompt ? (
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1 text-white p-2 rounded-full hover:bg-gray-300 cursor-pointer bg-white"
                  >
                    <ArrowUp className="size-4.5 text-black" />
                  </button>
                ) : (
                  <button className="flex items-center justify-center gap-1 text-white border border-gray-500  bg-[#636260] py-2 px-3 rounded-full hover:bg-[#454443] cursor-pointer">
                    <AudioLines className="size-4" />
                    <h3 className="text-sm">Voice</h3>
                  </button>
                )}
              </div>
            )}
          </form>
          {!user && messages.length == 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <button className="flex items-center justify-center gap-2 text-white border border-gray-600  bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                <Eye className="size-4 text-blue-400" />
                <h3 className="text-sm text-gray-400">Analyze images</h3>
              </button>
              <button className="flex items-center justify-center gap-2 text-white border border-gray-600  bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                <PencilLine className="size-4 text-pink-400" />
                <h3 className="text-sm text-gray-400">Help me write</h3>
              </button>
              <button className="flex items-center justify-center gap-2 text-white border border-gray-600  bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                <SquareTerminal className="size-4 text-blue-500" />
                <h3 className="text-sm text-gray-400">Code</h3>
              </button>
              <button className="flex items-center justify-center gap-2 text-white border border-gray-600  bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                <SquareChartGantt className="size-4 text-sm text-orange-500" />
                <h3 className="text-sm text-gray-400">Summarize text</h3>
              </button>
              <button className="flex items-center justify-center gap-2 text-white border border-gray-600  bg-transparent py-2 px-3 rounded-full hover:bg-[#555453] cursor-pointer">
                <h3 className="text-sm text-gray-400">More</h3>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
