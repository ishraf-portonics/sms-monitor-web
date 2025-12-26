<template>
  <div class="dashboard-container">
    <Header />

    <main class="main-content">
      <div class="panes-container">
        <!-- Pane 1: MSISDN List -->
        <div class="pane sidebar-msisdn">
          <div class="pane-header">
            <h3>MSISDNs</h3>
            <button @click="handleRefreshMSISDNs" class="icon-btn-sm" title="Refresh List">
              <span class="material-symbols-outlined">refresh</span>
            </button>
          </div>
          <div class="pane-content">
            <div v-if="smsStore.loadingMSISDNs" class="loading-state-sm">
              <div class="spinner-sm"></div>
            </div>
            <ul v-else class="list-group">
              <li 
                v-for="msisdn in smsStore.uniqueMSISDNs" 
                :key="msisdn"
                @click="handleSelectMSISDN(msisdn)"
                :class="['list-item', { active: smsStore.selectedMSISDN === msisdn }]"
              >
                <span class="material-symbols-outlined item-icon">sim_card</span>
                <span class="item-text monospace">{{ msisdn }}</span>
                <span class="material-symbols-outlined chevron">chevron_right</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Pane 2: Sender List -->
        <div class="pane sidebar-sender">
          <div class="pane-header">
            <div class="header-title">
              <h3>Senders</h3>
              <span v-if="smsStore.selectedMSISDN" class="subtitle-sm">{{ smsStore.selectedMSISDN }}</span>
            </div>
            <button 
              v-if="smsStore.selectedMSISDN" 
              @click="handleRefreshSenders" 
              class="icon-btn-sm" 
              title="Refresh List"
            >
              <span class="material-symbols-outlined">refresh</span>
            </button>
          </div>
          <div class="pane-content">
            <div v-if="!smsStore.selectedMSISDN" class="empty-selection">
              <span class="material-symbols-outlined">arrow_back</span>
              <p>Select an MSISDN</p>
            </div>
            <div v-else-if="smsStore.loadingSenders" class="loading-state-sm">
              <div class="spinner-sm"></div>
            </div>
            <ul v-else class="list-group">
              <li 
                v-for="sender in smsStore.filteredSenders" 
                :key="sender"
                @click="handleSelectSender(sender)"
                :class="['list-item', { active: smsStore.selectedSender === sender }]"
              >
                <div class="sender-avatar">{{ sender.charAt(0).toUpperCase() }}</div>
                <span class="item-text font-medium">{{ sender }}</span>
              </li>
               <li v-if="smsStore.filteredSenders.length === 0" class="empty-list">
                No senders found
              </li>
            </ul>
          </div>
        </div>

        <!-- Pane 3: Chat View -->
        <div class="pane chat-area">
          <div class="chat-header">
            <div v-if="smsStore.selectedSender" class="chat-header-info">
              <div class="chat-avatar">{{ smsStore.selectedSender.charAt(0).toUpperCase() }}</div>
              <div class="chat-meta">
                <h4>{{ smsStore.selectedSender }}</h4>
                <p>To: {{ smsStore.selectedMSISDN }}</p>
              </div>
            </div>
            <div v-else class="chat-header-placeholder">
              <h3>Message Details</h3>
            </div>
            
            <button 
              v-if="smsStore.selectedSender" 
              @click="handleRefreshChat" 
              class="icon-btn" 
              title="Refresh"
            >
              <span class="material-symbols-outlined">refresh</span>
            </button>
          </div>

          <div class="chat-content" ref="chatContentRef">
            <div v-if="!smsStore.selectedSender" class="empty-chat-state">
              <div class="empty-illustration">
                <span class="material-symbols-outlined">forum</span>
              </div>
              <h3>Select a Conversation</h3>
              <p>Choose a sender from the list to view messages.</p>
            </div>
            
            <div v-else-if="smsStore.loading" class="loading-state">
               <div class="spinner"></div>
               <p>Loading conversation...</p>
            </div>

            <div v-else class="messages-list">
              <div 
                v-for="sms in smsStore.currentConversation" 
                :key="sms.id" 
                class="message-bubble-wrapper"
              >
                <div class="message-timestamp-label">
                  {{ formatMessageDate(sms.received_at) }}
                </div>
                <div class="message-bubble">
                  <div class="bubble-content">
                     <div v-if="hasOTP(sms.message)" v-html="highlightOTP(sms.message)"></div>
                     <span v-else>{{ sms.message }}</span>
                  </div>
                  <div class="bubble-footer">
                    <span class="time">{{ formatTime(sms.received_at) }}</span>
                    <button 
                      @click="copyText(sms.message)" 
                      class="copy-btn-sm" 
                      title="Copy OTP or Message"
                    >
                      <span class="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="smsStore.currentConversation.length === 0" class="empty-list">
                No messages found.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";
import { useSMSStore } from "@/stores/sms";
import Header from "./Header.vue";
import { copyToClipboard } from "@/utils/clipboard";
import { highlightOTP, hasOTP, extractOTP } from "@/utils/otp";

const smsStore = useSMSStore();
const chatContentRef = ref<HTMLElement | null>(null);

const handleSelectMSISDN = async (msisdn: string) => {
  if (smsStore.selectedMSISDN === msisdn) return;
  await smsStore.selectMSISDN(msisdn);
};

const handleSelectSender = async (sender: string) => {
  if (smsStore.selectedSender === sender) return;
  await smsStore.selectSender(sender);
};

const handleRefreshMSISDNs = async () => {
  // Clear selection state
  smsStore.selectedMSISDN = null;
  smsStore.selectedSender = null;
  smsStore.currentConversation = [];
  smsStore.filteredSenders = [];

  // Reload list
  await smsStore.loadMSISDNsList();
};

const handleRefreshSenders = async () => {
  if (smsStore.selectedMSISDN) {
    // Re-triggering selection loads the senders again
    await smsStore.selectMSISDN(smsStore.selectedMSISDN);
  }
};

const handleRefreshChat = async () => {
  await smsStore.refreshConversation();
};

const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const copyText = async (text: string) => {
  try {
    const otps = extractOTP(text);
    // Prioritize copying OTP if found
    const textToCopy = otps.length > 0 ? otps[0] : text;
    if (textToCopy) {
      await copyToClipboard(textToCopy);
    }
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};


const scrollToBottom = () => {
  nextTick(() => {
    if (chatContentRef.value) {
      chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
    }
  });
};

watch(() => smsStore.currentConversation, () => {
  scrollToBottom();
});

onMounted(async () => {
  // Load initial lists
  await smsStore.loadMSISDNsList();
  // We don't strictly need to load all senders anymore since we load them per MSISDN
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--color-bg-light);
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
}

.panes-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.pane {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.pane-header {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-btn, .icon-btn-sm {
  padding: 8px;
  background: transparent;
  color: #999;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn-sm {
  padding: 4px;
}

.icon-btn:hover, .icon-btn-sm:hover {
  background-color: #f0f0f0;
  color: var(--color-primary);
}

.icon-btn-sm .material-symbols-outlined {
  font-size: 18px;
}

.pane-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

/* Sidebar Specifics */
.sidebar-msisdn {
  width: 280px;
  flex-shrink: 0;
}

.sidebar-sender {
  width: 300px;
  flex-shrink: 0;
}

.chat-area {
  flex: 1;
  background-color: var(--color-bg-light);
  border-right: none;
}

/* List Styles */
.list-group {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.2s;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.list-item.active {
  background-color: #e6f0ff;
  border-left: 4px solid var(--color-primary);
  padding-left: 12px; /* Compensate for border */
}

.item-icon {
  color: #666;
  font-size: 20px;
}

.item-text {
  flex: 1;
  font-size: 14px;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.monospace {
  font-family: monospace;
}

.font-medium {
  font-weight: 500;
}

.chevron {
  font-size: 18px;
  color: #999;
}

.list-item.active .chevron,
.list-item.active .item-icon,
.list-item.active .item-text {
  color: var(--color-primary);
  font-weight: 500;
}

/* Sender List */
.sender-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.list-item.active .sender-avatar {
  background-color: var(--color-primary);
  color: white;
}

.subtitle-sm {
  display: block;
  font-size: 11px;
  color: #666;
  margin-top: 4px;
  font-family: monospace;
}

/* Chat Area */
.chat-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.chat-meta h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.chat-meta p {
  margin: 0;
  font-size: 12px;
  color: #666;
  font-family: monospace;
}

.chat-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Messages */
.message-bubble-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
  max-width: 80%;
}

.message-timestamp-label {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
  margin-left: 12px;
}

.message-bubble {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  border-top-left-radius: 2px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  position: relative;
}

.bubble-content {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text);
  margin-bottom: 8px;
  word-break: break-word;
}

.bubble-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 8px;
  margin-top: 4px;
}

.time {
  font-size: 11px;
  color: #999;
}

.copy-btn-sm {
  padding: 4px;
  border-radius: 4px;
  color: #999;
  background: transparent;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-btn-sm:hover {
  background-color: #f0f0f0;
  color: var(--color-primary);
}

.copy-btn-sm .material-symbols-outlined {
  font-size: 16px;
}

/* States */
.empty-selection, .empty-chat-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  padding: 40px;
}

.empty-illustration .material-symbols-outlined {
  font-size: 64px;
  margin-bottom: 16px;
  color: #ddd;
}

.loading-state, .loading-state-sm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.spinner, .spinner-sm {
  border: 3px solid #eee;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner { width: 40px; height: 40px; margin-bottom: 16px; }
.spinner-sm { width: 24px; height: 24px; }

@keyframes spin { to { transform: rotate(360deg); } }

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .pane, .pane-header, .chat-header {
    background-color: #1e1e1e;
    border-color: #333;
  }
  
  .chat-area, .dashboard-container {
    background-color: #121212;
  }
  
  .list-item {
    border-color: #333;
    color: #eee;
  }
  
  .list-item:hover {
    background-color: #2a2a2a;
  }
  
  .list-item.active {
    background-color: #2c2c2c;
  }
  
  .message-bubble {
    background-color: #2c2c2c;
    border-color: #444;
  }
  
  .bubble-footer {
    border-top-color: #444;
  }
  
  .copy-btn-sm:hover {
    background-color: #444;
  }

  .sender-avatar {
    background-color: #333;
    color: #eee;
  }
  
  .empty-illustration .material-symbols-outlined {
    color: #333;
  }
}
</style>
