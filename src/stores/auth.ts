import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);

  const isLoggedIn = computed(() => token.value !== null);

  function init() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('plataMX');
      if (raw) {
        const parsed = JSON.parse(raw);
        token.value = parsed.token ?? null;
      }
    } catch {
      token.value = null;
    }
  }

  function saveToken(newToken: string) {
    token.value = newToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('plataMX', JSON.stringify({ token: newToken }));
    }
  }

  function logout() {
    token.value = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('plataMX');
    }
  }

  return { token, isLoggedIn, init, saveToken, logout };
});
