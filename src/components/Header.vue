<template>
  <header
    class="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b-2 border-slate-200/60 dark:border-slate-700/60 px-6 md:px-8 py-4 shadow-lg shadow-slate-200/20 dark:shadow-slate-950/40"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <div class="flex items-center gap-4">
        <div
          class="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform"
        >
          <span class="material-symbols-outlined text-2xl">sms</span>
        </div>
        <div>
          <h1
            class="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent"
          >
            SMS Monitor
          </h1>
          <p class="text-xs text-slate-500 dark:text-slate-400 hidden md:block">Real-time message tracking</p>
        </div>
      </div>
      <div class="flex items-center gap-4 md:gap-6">
        <div class="hidden md:flex items-center gap-4" v-if="user">
          <div class="text-right">
            <p
              class="text-sm font-semibold text-slate-900 dark:text-white leading-none"
            >
              {{ user.email }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              <span class="inline-flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Admin Access
              </span>
            </p>
          </div>
          <div
            class="relative size-11 overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md ring-2 ring-blue-500/20"
          >
            <!-- Using placeholder or user avatar if available -->
            <div class="flex items-center justify-center h-full w-full text-white font-bold text-lg">
              {{ user?.email?.charAt(0).toUpperCase() || 'U' }}
            </div>
          </div>
        </div>
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-red-400 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <span class="material-symbols-outlined text-[18px]">logout</span>
          <span class="hidden md:inline">{{ isLoggingOut ? "..." : "Logout" }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { user, logout } = useAuth();
const isLoggingOut = ref(false);

const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await logout();
    router.push("/login");
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
