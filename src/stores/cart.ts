import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const totalItems = ref(0);

  function setTotal(n: number) {
    totalItems.value = n;
  }

  function addDelta(delta: number) {
    totalItems.value = Math.max(0, totalItems.value + delta);
  }

  function reset() {
    totalItems.value = 0;
  }

  return { totalItems, setTotal, addDelta, reset };
});
