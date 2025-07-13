import type { User } from "@/store/useAuthStore";
import apiClient from "./client";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  user?: T;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/login",
      credentials
    );
    return response.data.user as User;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/register",
      credentials
    );
    return response.data.user as User;
  },

  logout: async (): Promise<void> => {
    await apiClient.post<ApiResponse<null>>("/auth/logout");
  },

  checkAuth: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>("/auth/check");
    return response.data.user as User;
  },

  updateProfile: async (formData: FormData): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      "/auth/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.user as User;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiClient.post("/auth/forgot-password", { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await apiClient.post("/auth/reset-password", { token, password });
  },
};
