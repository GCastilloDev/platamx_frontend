import { defineStore } from 'pinia';
import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

export const useCollectionsStore = defineStore('globalCollections', {
  state: () => ({
    collections: [] as any[],
    loading: false,
    error: null as any,
  }),
  actions: {
    async fetchCollections() {
      // Don't refetch if already loaded
      if (this.collections.length > 0) return;

      this.loading = true;
      try {
        const url = `${API_BASE_URL}/collections?page=1&items=25`;
        const { data: response } = await axios.get(url);
        
        this.collections = response.data.map((e: any) => ({
          id: e.id,
          title: e.name,
          title_en: e.name_en || e.name,
          selected: false,
        }));
      } catch (err: any) {
        console.error('Error prefetching collections:', err);
        this.error = err;
      } finally {
        this.loading = false;
      }
    }
  }
});
