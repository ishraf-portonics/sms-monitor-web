<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-950 font-display text-slate-900 dark:text-slate-100">
    <Header />

    <main class="flex-1 px-4 py-8 md:px-8 lg:px-12">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <!-- Page Header -->
        <div class="flex flex-col gap-2">
          <h2 class="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
            SMS Messages
          </h2>
          <p class="text-slate-600 dark:text-slate-400">Monitor and manage all incoming SMS messages</p>
        </div>

        <!-- Toolbar Area -->
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <!-- Search Bar -->
          <div class="w-full md:max-w-md">
            <label class="relative flex w-full items-center group">
              <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span class="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                v-model="searchQuery"
                class="h-12 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 dark:focus:ring-primary/20 outline-none transition-all shadow-sm"
                placeholder="Search by MSISDN, sender, or message content..."
                type="text"
                @input="handleSearch"
              />
            </label>
          </div>
          <!-- Actions -->
          <button
            @click="handleRetry"
            class="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200"
          >
            <span class="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-180 duration-500">refresh</span>
            <span>Refresh List</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="smsStore.loading && smsStore.messages.length === 0" class="flex flex-col items-center justify-center py-32">
          <div class="relative">
             <div class="h-16 w-16 rounded-full border-4 border-slate-200 dark:border-slate-700"></div>
             <div class="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
          <p class="mt-6 text-slate-600 dark:text-slate-400 font-medium">Loading messages...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="smsStore.error" class="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-lg">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 mb-4">
            <span class="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">error</span>
          </div>
          <p class="text-red-700 dark:text-red-300 mb-6 font-medium">{{ smsStore.error }}</p>
          <button @click="handleRetry" class="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-all hover:scale-105">Try Again</button>
        </div>

        <!-- Table Container -->
        <div v-else class="flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1000px] text-left">
              <thead>
                <tr class="border-b-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 via-blue-50/50 to-slate-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-slate-800">
                  <th class="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-32">
                    ID
                  </th>
                  <th class="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-40">
                    MSISDN
                  </th>
                  <th class="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-40">
                    Sender
                  </th>
                  <th class="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Message
                  </th>
                  <th class="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-44">
                    Received At
                  </th>
                  <th class="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-44">
                    Created At
                  </th>
                  <th class="whitespace-nowrap px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-24 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                <tr
                  v-for="sms in filteredMessages"
                  :key="sms.id"
                  class="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent dark:hover:from-blue-900/10 dark:hover:to-transparent transition-all duration-200"
                >
                  <td class="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono">
                    {{ sms.id }}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap font-mono font-medium">
                    {{ sms.msisdn }}
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></div>
                      {{ sms.sender }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-md">
                    <div class="flex items-center gap-2">
                       <!-- Using v-html for highlighted OTP if present -->
                       <div v-if="hasOTP(sms.message)" v-html="highlightOTP(sms.message)" class="leading-relaxed"></div>
                       <span v-else class="leading-relaxed">{{ sms.message }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {{ formatDate(sms.received_at) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {{ formatDate(sms.created_at) }}
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      @click="copyText(sms.message)"
                      aria-label="Copy message"
                      class="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all hover:scale-110"
                      title="Copy to clipboard"
                    >
                      <span class="material-symbols-outlined text-[20px]">content_copy</span>
                    </button>
                  </td>
                </tr>
                 <!-- Empty State in Table -->
                <tr v-if="filteredMessages.length === 0">
                  <td colspan="7" class="px-6 py-20 text-center">
                    <div class="flex flex-col items-center gap-3">
                      <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span class="material-symbols-outlined text-4xl text-slate-400">inbox</span>
                      </div>
                      <p class="text-slate-500 dark:text-slate-400 font-medium">No messages found matching your search.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination / Load More -->
          <div class="flex items-center justify-between border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Showing <span class="font-semibold text-slate-900 dark:text-white">{{ filteredMessages.length }}</span> of <span class="font-semibold text-slate-900 dark:text-white">{{ smsStore.totalCount }}</span> results
            </p>
            <div class="flex gap-2" v-if="smsStore.hasMore">
               <button
                  @click="handleLoadMore"
                  :disabled="smsStore.loading"
                  class="rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  {{ smsStore.loading ? 'Loading...' : 'Load More' }}
                </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-6 flex justify-center">
          <div class="flex items-center gap-3 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-800/50 px-6 py-3 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
            <span class="material-symbols-outlined text-[18px] text-slate-500">lock</span>
            <p class="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wide">
              Internal QA Use Only - Do not share externally.
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useSMSStore } from "@/stores/sms";
import Header from "./Header.vue";
import { copyToClipboard } from "@/utils/clipboard";
import { highlightOTP, hasOTP } from "@/utils/otp";

const smsStore = useSMSStore();
const searchQuery = ref("");

const handleLoadMore = async () => {
  await smsStore.loadMoreMessages();
};

const handleRetry = async () => {
  await smsStore.loadMessages();
};

const handleSearch = () => {
  // Client-side filtering for now, or implement server-side if API supports it
  // Using computed filteredMessages for client-side
};

const filteredMessages = computed(() => {
  if (!searchQuery.value) return smsStore.messages;
  const query = searchQuery.value.toLowerCase();
  return smsStore.messages.filter(sms => 
    sms.sender.toLowerCase().includes(query) || 
    sms.message.toLowerCase().includes(query) ||
    sms.msisdn.toLowerCase().includes(query)
  );
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // If less than 1 hour, show relative time
  if (diff < 60 * 60 * 1000) {
    const mins = Math.floor(diff / (60 * 1000));
    return mins < 1 ? 'Just now' : `${mins} mins ago`;
  }
  
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const copyText = async (text: string) => {
  try {
    await copyToClipboard(text);
    // Could add toast notification here
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

onMounted(async () => {
  await smsStore.loadMessages();
});
</script>
