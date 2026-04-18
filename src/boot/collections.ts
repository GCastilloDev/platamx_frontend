import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { globalCollections } from '../stores/globalCollections';
import { API_BASE_URL } from '../constants/api';

export default boot(async () => {
  try {
    const url = `${API_BASE_URL}/collections?page=1&items=25`;
    const { data: response } = await axios.get(url);
    
    globalCollections.value = response.data.map((e: any) => ({
      id: e.id,
      title: e.name,
      title_en: e.name_en || e.name,
      selected: false,
    }));
  } catch (error) {
    console.error('Error prefetching collections:', error);
  }
});
