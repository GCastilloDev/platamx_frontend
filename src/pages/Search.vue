<template>
  <section class="search__container">
    <h2 class="search__title">Dijes de Zirconia para mujer</h2>

    <!-- <div class="search__result">
      <ProductCard class="search__result_item" v-for="i in 10" />
    </div> -->

    <div class="row">
      <div class="col-3" v-for="i in 10">
        <ProductCard class="search__result_item" />
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from "../components/ProductCard.vue";
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
</style>
