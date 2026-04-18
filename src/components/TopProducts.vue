<template>
  <section class="top-products__container">
    <h2 class="top-products__title">{{ t('top_products_title') }}</h2>
    <section class="top-products__menu">
      <div
        v-for="(collection, index) in collections"
        class="top-products__menu--item"
        :class="{ 'menu--item__selected': collection.selected }"
        @click="changeCollection(index)"
      >
        <span>{{ locale === 'en-US' ? (collection.title_en || collection.title) : collection.title }}</span>
      </div>
    </section>
    <section class="top-products__container-card">
      <section class="top-products__container-card-carrusell">
        <!-- <ProductCard v-for="i in 10" /> -->
        <ProductCard
          v-for="product in productsByCollection"
          :product="product"
          :loading="loading"
        />
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, watchEffect } from "vue";
import { useCollectionsStore } from "../stores/globalCollections";
import { storeToRefs } from "pinia";
import { useI18n } from 'vue-i18n';
import { API_BASE_URL } from "../constants/api";

import ProductCard from "../components/ProductCard.vue";

const { t, locale } = useI18n();

type collection = {
  id: number;
  title: string;
  title_en: string;
  selected: boolean;
};

const collections = ref<collection[]>([]);
const productsByCollection = ref([]);
const loading = ref(true);

async function getProductsByCollection(collectionID: number) {
  try {
    loading.value = true;
    productsByCollection.value = [null, null, null];
    const url = `${API_BASE_URL}/products?page=1&items=10&collestionsIds=${collectionID}`;
    const { data: response } = await axios.get(url);
    productsByCollection.value = response.data;
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

const collectionsStore = useCollectionsStore();
const { collections: storeCollections } = storeToRefs(collectionsStore);

watchEffect(() => {
  if (storeCollections.value.length > 0 && collections.value.length === 0) {
    collections.value = storeCollections.value.slice(0, 5).map((e: any, idx: number) => ({
      id: e.id,
      title: e.title,
      title_en: e.title_en,
      selected: idx === 0,
    }));
    
    if (collections.value.length > 0) {
      getProductsByCollection(collections.value[0].id);
    }
  }
});

async function changeCollection(index: number) {
  try {
    if (collections.value[index].selected) return;
    const indexSelected = collections.value.findIndex((e) => e.selected);
    const productCollectionID = collections.value[index].id;

    collections.value[indexSelected].selected = false;
    collections.value[index].selected = true;

    await getProductsByCollection(productCollectionID);
  } catch (error) {
    console.log(error);
  }
}


</script>

<style scoped>
.top-products__container-card {
  margin-top: 30px;
  padding-right: 60px;
  padding-left: 60px;
}

.top-products__container-card-carrusell {
  display: flex;
  gap: 20px;
  width: 100%;
  overflow: auto;
}
.top-products__container {
  margin-top: 70px;
}

.top-products__title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 44px;
  line-height: 57.2px;
  letter-spacing: calc(44px * 0.03);
  color: #2d2e36;
  text-align: center;
}

.top-products__menu {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 40px;
}

.top-products__menu--item {
  font-weight: 400;
  font-size: 18px;
  line-height: 25.2px;
  letter-spacing: calc(18px * 0.05);
  color: #707279;
}

.menu--item__selected {
  padding: 18px 22px 18px 22px;
  background-color: #2f3033;
  color: #ffffff;
  border-radius: 360px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.top-products__menu--item:hover {
  cursor: pointer;
  text-decoration: underline;
}
.menu--item__selected:hover {
  cursor: pointer;
  text-decoration: none;
}

.top-products__carrousel {
  margin-top: 50px;
  padding-left: 30px;
}

@media (max-width: 1024px) {
  .top-products__container-card {
    padding-left: 20px;
    padding-right: 20px;
  }
  .top-products__title {
    font-size: 32px;
    line-height: 48px;
    padding: 0 10px;
  }
  .top-products__menu {
    flex-wrap: wrap;
    column-gap: 15px;
    row-gap: 15px;
  }
  .top-products__menu--item {
    font-size: 16px;
  }
}
</style>
