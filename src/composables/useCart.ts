import { storeToRefs } from 'pinia';
import { useCartStore } from '../stores/cart';

export function useCart() {
  const store = useCartStore();
  const { totalItems } = storeToRefs(store);

  return {
    totalItems,
    setTotal: store.setTotal,
    addDelta: store.addDelta,
    reset: store.reset,
  };
}
