import api from "./api";
import type { RegisterData } from "../../types/User";

export const registerUser = (userData: RegisterData) =>
  api.post("/auth/register", userData);

export const loginUser = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const forgotPassword = (email: string) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (
  email: string,
  code: string,
  newPassword: string
) => api.post("/auth/reset-password", { email, code, newPassword });

export const verifyCode = (email: string, code: string, action: string) =>
  api.post("/auth/verify-code", { email, code, action });

export const loadUserProfile = () => api.get("/auth/get-me");
