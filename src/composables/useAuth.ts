import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';

export function useAuth() {
  const store = useAuthStore();
  const { isLoggedIn, token } = storeToRefs(store);

  function onLogin(callback: () => void) {
    watch(isLoggedIn, (loggedIn) => {
      if (loggedIn) callback();
    });
  }

  return {
    isLoggedIn,
    token,
    init: store.init,
    saveToken: store.saveToken,
    logout: store.logout,
    onLogin,
  };
}
