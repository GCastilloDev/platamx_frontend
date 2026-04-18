import { defineStore } from 'pinia';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import type { Product } from '../types';

export const useCurrentProductStore = defineStore('currentProduct', {
  state: () => ({
    product: null as Product | null,
    loading: false,
    error: null as any,
  }),
  actions: {
    async fetchProduct(idProduct: string) {
      if (this.product && String(this.product.id) === String(idProduct)) {
        // If we already have the product fetched, don't refetch
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const url = `${API_BASE_URL}/products/${idProduct}`;
        const { data: response } = await axios.get(url);
        
        const fetchedProduct = response.data;
        if (!fetchedProduct.images || fetchedProduct.images.length === 0) {
          fetchedProduct.images = [];
          fetchedProduct.images.push({
            id: 0,
            file_name: "default",
            url: "https://res.cloudinary.com/dhils8jyq/image/upload/v1725562192/plata_generico_on9yy1.jpg",
          });
        }
        
        this.product = fetchedProduct;
      } catch (err: any) {
        console.error('Error fetching product for SSR:', err);
        this.error = err;
        this.product = null;
      } finally {
        this.loading = false;
      }
    }
  }
});
