import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { SMS, SMSFilter } from "@/services/sms";
import {
  fetchSMS,
  searchSMS,
  getUniqueSenders,
  getUniqueMSISDNs,
} from "@/services/sms";

const PAGE_SIZE = 50;

export const useSMSStore = defineStore("sms", () => {
  const messages = ref<SMS[]>([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(0);
  const filters = ref<SMSFilter>({});
  const searchTerm = ref("");
  const uniqueSenders = ref<string[]>([]);
  const uniqueMSISDNs = ref<string[]>([]);
  const loadingSenders = ref(false);
  const loadingMSISDNs = ref(false);

  const hasMore = computed(() => {
    return messages.value.length < totalCount.value;
  });

  const clearError = () => {
    error.value = null;
  };

  const loadMessages = async (page: number = 0, reset: boolean = true) => {
    try {
      loading.value = true;
      error.value = null;

      const offset = page * PAGE_SIZE;

      let result;
      if (searchTerm.value) {
        result = await searchSMS(
          searchTerm.value,
          PAGE_SIZE,
          offset,
          filters.value
        );
      } else {
        result = await fetchSMS(PAGE_SIZE, offset, filters.value);
      }

      if (reset) {
        messages.value = result.data;
      } else {
        messages.value.push(...result.data);
      }

      totalCount.value = result.count;
      currentPage.value = page;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to load messages";
    } finally {
      loading.value = false;
    }
  };

  const loadMoreMessages = async () => {
    if (!loading.value && hasMore.value) {
      await loadMessages(currentPage.value + 1, false);
    }
  };

  const setFilters = async (newFilters: SMSFilter) => {
    filters.value = newFilters;
    currentPage.value = 0;
    await loadMessages(0, true);
  };

  const setSearchTerm = async (term: string) => {
    searchTerm.value = term;
    currentPage.value = 0;
    await loadMessages(0, true);
  };

  const clearSearch = async () => {
    searchTerm.value = "";
    currentPage.value = 0;
    await loadMessages(0, true);
  };

  const clearFilters = async () => {
    filters.value = {};
    searchTerm.value = "";
    currentPage.value = 0;
    await loadMessages(0, true);
  };

  const loadSendersList = async () => {
    try {
      loadingSenders.value = true;
      uniqueSenders.value = await getUniqueSenders();
    } catch (err) {
      console.error("Failed to load senders:", err);
    } finally {
      loadingSenders.value = false;
    }
  };

  const loadMSISDNsList = async () => {
    try {
      loadingMSISDNs.value = true;
      uniqueMSISDNs.value = await getUniqueMSISDNs();
    } catch (err) {
      console.error("Failed to load MSISDNs:", err);
    } finally {
      loadingMSISDNs.value = false;
    }
  };

  return {
    // State
    messages,
    totalCount,
    loading,
    error,
    currentPage,
    filters,
    searchTerm,
    uniqueSenders,
    uniqueMSISDNs,
    loadingSenders,
    loadingMSISDNs,

    // Computed
    hasMore,

    // Actions
    clearError,
    loadMessages,
    loadMoreMessages,
    setFilters,
    setSearchTerm,
    clearSearch,
    clearFilters,
    loadSendersList,
    loadMSISDNsList,
  };
});
