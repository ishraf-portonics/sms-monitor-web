import { useAuthStore } from "@/stores/auth";
import { signInWithGoogle, signOut } from "@/services/auth";

export const useAuth = () => {
  const authStore = useAuthStore();

  const login = async () => {
    try {
      authStore.clearError();
      await signInWithGoogle();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      authStore.setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      authStore.clearError();
      await signOut();
      authStore.setUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Logout failed. Please try again.";
      authStore.setError(message);
      throw err;
    }
  };

  return {
    user: authStore.user,
    loading: authStore.loading,
    error: authStore.error,
    isAuthenticated: authStore.isAuthenticated,
    login,
    logout,
  };
};
