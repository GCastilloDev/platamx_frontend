<template>
  <section class="top-products__container">
    <h2 class="top-products__title">Los mejores accesorios</h2>
    <section class="top-products__menu">
      <div class="top-products__menu--item menu--item__selected">
        <span>Dijes de Zirconia</span>
      </div>
      <div class="top-products__menu--item"><span>Cadenas</span></div>
      <div class="top-products__menu--item"><span>Anillos</span></div>
      <div class="top-products__menu--item"><span>Esclavas</span></div>
      <div class="top-products__menu--item"><span>Rosarios</span></div>
    </section>

    <section class="top-products__container-card">
      <section class="top-products__container-card-carrusell">
        <ProductCard v-for="i in 10" />
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import ProductCard from "../components/ProductCard.vue";
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
