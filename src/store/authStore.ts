import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import type { User, RegisterData } from "../types/User";
import {
  registerUser,
  loginUser,
  loadUserProfile,
} from "../services/api/authApi";
import type { Conversation } from "../types/Conversation";

interface AuthState {
  user: User | null;
  conversations: Conversation[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  register: (userData: RegisterData) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  loadUser: () => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      conversations: [],
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setConversations: (conversations) => set({ conversations }),
      addConversation: (conversation) => {
        set((state) => ({
          conversations: [conversation, ...state.conversations, ],
        }));
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => {
        if (error) toast.error(error);
        set({ error });
      },
      clearError: () => set({ error: null }),

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await registerUser(userData);
          if (response.data.success) {
            set({ isLoading: false }); // <-- Dừng loading sau khi thành công
            return true;
          } else {
            const message = response.data.message;
            set({ isLoading: false, error: message });
            toast.error(message);
            return false;
          }
        } catch (err: any) {
          const errorMessage =
            err.response?.data?.message || "Registration failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          toast.error(errorMessage);
          return false;
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await loginUser(email, password);
          if (response.data.success === true) {
            const { token, user } = response.data;

            set({
              token,
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            toast.success(`Welcome back, ${user.firstName} ${user.surname}!`);
            return true;
          } else {
            const message = response.data.message || "Login failed";
            set({ isLoading: false, error: message, isAuthenticated: false });
            toast.error(message);
            return false;
          }
        } catch (err: any) {
          console.log(err);
          const errorMessage = err.response?.data?.message || "Login failed";
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            token: null,
            user: null,
          });
          toast.error(errorMessage);
          return false;
        }
      },
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
        toast.success("Logged out successfully");
      },
      loadUser: async () => {
        const token = get().token;
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false });
          return;
        }
        try {
          set({ isLoading: true });
          const response = await loadUserProfile();
          const user = response.data.user;
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const errorMessage = "Session expired. Please login again.";
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          toast.error(errorMessage);
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (!currentUser) {
          toast.error("No user found to update.");
          return;
        }

        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
      },
    }),
    {
      name: "chatgpt-clone-auth",
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
