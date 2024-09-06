<template>
  <section class="search__container">
    <h2 class="search__title">{{ collection }}</h2>

    <!-- <div class="search__result">
      <ProductCard class="search__result_item" v-for="i in 10" />
    </div> -->

    <div class="row">
      <div class="col-3" v-for="product in products">
        <ProductCard
          class="search__result_item"
          :loading="loading"
          :product="product"
        />
      </div>
      <p v-if="!loading && products.length == 0">Sin productos</p>
    </div>
    <div v-if="isNext" class="text-center" style="margin-top: 25px">
      <q-btn
        class="btn__more"
        @click="chargeMoreProducts()"
        unelevated
        rounded
        no-caps
        :loading="loadingBtn"
        size="lg"
        label="Cargar más"
      />
    </div>
  </section>
</template>

<script setup>
import axios from "axios";
import ProductCard from "../components/ProductCard.vue";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

const route = useRoute();
const loading = ref(true);
const products = ref([null, null, null]);
const collection = ref("");
const isNext = ref(false);
const loadingBtn = ref(false);
let page = ref(1);

function init() {
  page.value = 1;
  isNext.value = false;
  collection.value = route.params.name;
  loading.value = true;
  products.value = [null, null, null];
  const idCollection = route.params.id;
  getProductsByCollection(idCollection);
}

async function chargeMoreProducts() {
  try {
    const idCollection = route.params.id;
    loadingBtn.value = true;
    page.value += 1;
    const url = `https://platamx-backend-98b7dd1a72e1.herokuapp.com/products?page=${page.value}&items=8&collestionsIds=${idCollection}`;
    const { data: response } = await axios.get(url);

    response.data.forEach((e) => {
      products.value.push(e);
    });
    loading.value = false;
    isNext.value = response.pagination.next;
    loadingBtn.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function getProductsByCollection(idCollection) {
  try {
    const url = `https://platamx-backend-98b7dd1a72e1.herokuapp.com/products?page=${page.value}&items=8&collestionsIds=${idCollection}`;
    const { data: response } = await axios.get(url);
    products.value = response.data;
    loading.value = false;
    isNext.value = response.pagination.next;
  } catch (error) {
    console.log(error);
  }
}

watch(
  () => route.params.id,
  (newId, oldId) => {
    console.log("ENTREEEE");
    init();
  }
);

init();
</script>

<style lang="scss" scoped>
.search__container {
  margin-left: 60px;
  margin-right: 60px;

  margin-top: 50px;
  margin-bottom: 50px;
}

.search__title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 44px;
  color: #2f3033;
  line-height: 57.2px;
  letter-spacing: calc(44px * 0.03);
}

.search__result {
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: 20px;
}

.search__result_item {
  margin-bottom: 20px;
}

.btn__more {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 64px;
  text-align: center;
  width: 260px;
  height: 50px;
  border-radius: 360px;
  padding: 2px 16px;
  background-color: #2f3033;
  color: white;
  letter-spacing: 1px;
}
</style>
