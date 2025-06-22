import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore, type User } from "../store/useAuthStore";

export function useAuthCheck() {
  const { setUser, isAuthenticated } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ["authCheck"],
    queryFn: async () => {
      try {
        const data: User = await authApi.checkAuth();
        setUser(data);
        return data;
      } catch (error) {
        setUser(null);
        throw error;
      }
    },
    retry: false,
    enabled: !isAuthenticated,
  });

  return { isLoading };
}
