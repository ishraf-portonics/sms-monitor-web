<template>
  <div>Auth Callback Loading...</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  // Supabase handles the callback automatically
  // Redirect to dashboard after a brief delay to ensure session is set
  setTimeout(() => {
    router.push("/dashboard");
  }, 1000);
});
</script>
