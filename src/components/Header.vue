<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <div class="logo-box">
          <span class="material-symbols-outlined logo-icon">sms</span>
        </div>
        <div class="logo-text">
          <h1>SMS Monitor</h1>
          <p class="logo-subtitle">Real-time message tracking</p>
        </div>
      </div>
      
      <div class="user-section">
        <div class="user-info" v-if="user">
          <div class="user-details">
            <p class="user-name">{{ user.user_metadata?.full_name || 'User' }}</p>
            <p class="user-email">{{ user.email }}</p>
          </div>
          <div class="user-avatar">
            <img 
              v-if="user.user_metadata?.avatar_url" 
              :src="user.user_metadata.avatar_url" 
              alt="User Avatar" 
              class="avatar-img"
            />
            <span v-else>{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</span>
          </div>
        </div>
        
        <button
          @click="handleLogout"
          :disabled="isLoggingOut"
          class="logout-btn"
        >
          <span class="material-symbols-outlined btn-icon">logout</span>
          <span class="btn-text">{{ isLoggingOut ? "..." : "Logout" }}</span>
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

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 24px;
}

.header-content {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-box {
  width: 40px;
  height: 40px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo-icon {
  font-size: 24px;
}

.logo-text h1 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  text-align: right;
  line-height: 1.3;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.user-email {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #eee;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #555;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: #666;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #f5f5f5;
  color: var(--color-error);
  border-color: var(--color-error);
}

.logout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
}

.btn-text {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .logo-subtitle, .user-info {
    display: none;
  }
}

@media (prefers-color-scheme: dark) {
  .logo-subtitle, .user-email {
    color: #999;
  }
  
  .user-avatar {
    background-color: #333;
    color: #eee;
  }
  
  .logout-btn {
    color: #aaa;
  }
  
  .logout-btn:hover {
    background-color: #333;
  }
}
</style>
