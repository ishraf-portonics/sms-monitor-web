import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, onAuthStateChange } from "@/services/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  const initializeAuth = async () => {
    try {
      loading.value = true;
      error.value = null;

      // Check existing session
      const currentUser = await getCurrentUser();
      user.value = currentUser;

      // Listen for auth state changes
      const subscription = onAuthStateChange((authUser: User | null) => {
        user.value = authUser;
      });

      return subscription;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to initialize auth";
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const setError = (msg: string | null) => {
    error.value = msg;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    initializeAuth,
    setUser,
    setError,
    clearError,
  };
});
