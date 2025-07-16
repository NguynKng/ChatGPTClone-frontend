import api from "./api";

export const generateContent = (prompt: string) =>
  api.post("/conversations/generate-content", { prompt });

export const startNewChat = (prompt: string, name: string) =>
  api.post("/conversations", {
    prompt,
    name,
  });

export const sendPromptToConversation = (
  conversationId: string,
  prompt: string
) =>
  api.post(`/conversations/${conversationId}`, {
    prompt,
  });

export const getConversations = () => api.get("/conversations");
export const getMessagesByConversationId = (conversationId: string) =>
  api.get(`/conversations/${conversationId}`);

export const deleteConversation = (conversationId: string) =>
  api.delete(`/conversations/${conversationId}`);

export const renameConversation = (conversationId: string, title: string) =>
  api.put(`/conversations/rename/${conversationId}`, {
    title,
  });
