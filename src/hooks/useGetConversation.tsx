import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import { getConversations } from "../services/api/conversationApi";

export const useGetConversations = () => {
  const { conversations, setConversations, user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getConversations();

        if (response.data.success) {
          setConversations(response.data.data || []);
        } else {
          setError(response.data.message || "Không thể tải danh sách hội thoại");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Có lỗi xảy ra khi tải danh sách hội thoại");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, setConversations]); // 👈 thêm `query` vào dependency

  return {
    conversations,
    loading,
    error,
  };
};
