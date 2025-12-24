<template>
  <div
    class="font-display antialiased text-slate-900 dark:text-white bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
  >
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
    </div>

    <div class="w-full max-w-md flex flex-col gap-8 relative z-10">
      <div
        class="relative flex flex-col bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50 border-2 border-slate-200/60 dark:border-slate-700/60 overflow-hidden"
      >
        <!-- Header Section -->
        <div class="flex flex-col items-center pt-12 pb-8 px-8 sm:px-10">
          <div
            class="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
          >
            <span
              aria-hidden="true"
              class="material-symbols-outlined text-5xl text-white"
              >sms</span
            >
          </div>
          <h1
            class="text-slate-900 dark:text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight text-center bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent"
          >
            SMS Monitor
          </h1>
          <p
            class="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal pt-3 text-center"
          >
            Internal QA SMS monitoring tool
          </p>
        </div>
        
        <!-- Form Section -->
        <div class="px-8 sm:px-10 pb-12 flex flex-col gap-6">
           <div
            v-if="error"
            class="p-5 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start gap-4 mb-2 shadow-sm"
          >
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <span class="material-symbols-outlined text-xl text-red-600 dark:text-red-400">error</span>
            </div>
            <p class="text-red-700 dark:text-red-300 text-sm font-medium leading-relaxed pt-1.5">{{ error }}</p>
          </div>

          <button
            @click="handleGoogleLogin"
            :disabled="isLoading"
            class="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl h-16 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-200 text-white font-bold text-lg leading-normal tracking-wide shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 outline-none focus:ring-4 focus:ring-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            id="login-btn"
          >
            <div v-if="!isLoading" class="btn-content flex items-center w-full justify-center">
              <div
                class="absolute left-3 top-3 bottom-3 aspect-square bg-white rounded-xl flex items-center justify-center shadow-md"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
              </div>
              <span class="pl-8">Sign in with Google</span>
            </div>
            <div
              v-else
              class="loading-content flex items-center justify-center gap-3"
            >
              <svg
                class="animate-spin h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                ></path>
              </svg>
              <span class="text-white font-semibold"
                >Signing In...</span
              >
            </div>
          </button>
          
          <div class="flex items-center gap-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 px-4 py-3 border-2 border-slate-200 dark:border-slate-700">
            <span class="material-symbols-outlined text-[18px] text-slate-500">lock</span>
            <p class="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Authorized personnel only.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { login, error, loading: authLoading } = useAuth();
const isLoading = ref(false);

const handleGoogleLogin = async () => {
  try {
    isLoading.value = true;
    await login();
    // Router will handle redirect via auth state change
  } catch (err) {
    console.error("Login error:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>
