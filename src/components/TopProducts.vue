<template>
  <section class="top-products__container">
    <h2 class="top-products__title">Los mejores accesorios</h2>
    <section class="top-products__menu">
      <div
        v-for="(collection, index) in collections"
        class="top-products__menu--item"
        :class="{ 'menu--item__selected': collection.selected }"
        @click="changeCollection(index)"
      >
        <span>{{ collection.title }}</span>
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
import { ref } from "vue";

import ProductCard from "../components/ProductCard.vue";

type collection = {
  id: number;
  title: string;
  selected: boolean;
};

const collections = ref<collection[]>([]);
const productsByCollection = ref([]);
const loading = ref(true);

async function getProductsByCollection(collectionID: number) {
  try {
    loading.value = true;
    productsByCollection.value = [null, null, null];
    const url = `https://platamx-backend-98b7dd1a72e1.herokuapp.com/products?page=1&items=10&collestionsIds=${collectionID}`;
    const { data: response } = await axios.get(url);
    productsByCollection.value = response.data;
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function getCollections() {
  try {
    const url =
      "https://platamx-backend-98b7dd1a72e1.herokuapp.com/collections?page=1&items=25";
    const { data: response } = await axios.get(url);

    response.data.forEach((e: any) => {
      const item = {
        id: e.id,
        title: e.name,
        selected: false,
      };

      collections.value.push(item);
    });

    collections.value = collections.value.slice(0, 5);
    collections.value[0].selected = true;
    const collectionID = collections.value[0].id;
    getProductsByCollection(collectionID);
  } catch (error) {
    console.log(error);
  }
}

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

getCollections();
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
</style>
