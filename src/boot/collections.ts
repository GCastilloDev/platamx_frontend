import { boot } from 'quasar/wrappers';
import { useCollectionsStore } from '../stores/globalCollections';

export default boot(async ({ store }) => {
  const collectionsStore = useCollectionsStore(store);
  await collectionsStore.fetchCollections();
});
