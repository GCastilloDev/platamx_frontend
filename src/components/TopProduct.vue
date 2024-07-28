<template>
  <section class="top-product__container">
    <div class="top-product__images">
      <q-carousel
        class="prueba"
        autoplay="1"
        animated
        v-model="slide"
        navigation
        infinite
      >
        <q-carousel-slide
          :name="1"
          img-src="../assets/images/Imagen de producto 07 652 x 631.jpg"
        />
        <q-carousel-slide
          :name="2"
          img-src="../assets/images/Imagen de producto 04 652 x 630.jpg"
        />
        <q-carousel-slide
          :name="3"
          img-src="../assets/images/Imagen de producto 15 652 x 638.jpg"
        />
        <q-carousel-slide
          :name="4"
          img-src="../assets/images/Imagen de producto 10 652 x 633.jpg"
        />
      </q-carousel>
    </div>
    <div class="top-product__detail">
      <section>
        <div class="top-products__tag">Dije de zirconia</div>
        <h2>Corazón Blanco</h2>
        <p class="top-product__price">$999.00 MXN</p>
        <div class="hero__button">
          <button>
            <span>Ver producto</span>
          </button>
        </div>

        <hr />

        <p class="top-product__title-list">Detalle del producto</p>
        <ul class="top-product__list">
          <li>Largo de Cadena: 45 cm</li>
          <li>Alto del Corazón: 1.2 mm</li>
          <li>Largo del Corazón: 1.4 mm</li>
          <li>Alto del Love: 1.7 mm</li>
          <li>Largo del Love: 0.9 mm</li>
          <li>Piedra: Zirconia</li>
        </ul>
        <p>Kilataje del Oro 100% Oro Blanco 14k Garantizado de por Vida</p>
        <hr />
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const slide = ref(1);
</script>

<style scoped>
.top-product__container {
  margin-top: 100px;
  display: flex;
}
.top-product__images {
  width: 50%;
}

.prueba {
  height: 830px;
}

h2 {
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 44px;
  line-height: 57.2px;
  color: #2d2e36;
}

.top-product__tag {
  display: inline;
  font-family: "Switzer-Variable", serif;
  font-weight: 400;
  font-size: 120px;
  background-color: #f8f8f8;
  color: #2f3033;
  letter-spacing: 1px;
  border-radius: 12px;
  padding: 2px 16px;
  font-size: 12px;
  line-height: 16.8px;
  margin: 0px;
  margin-bottom: 0px;
}

.hero__button > button {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 260px;
  height: 50px;
  border-radius: 360px;
  padding: 2px 16px;
  background-color: #2f3033;
  color: #ffff;
  font-size: 16px;
  letter-spacing: 1px;
}

.top-product__detail {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.top-product__detail > section {
  width: 90%;
}

.top-product__price {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 24px;
  color: #4f4f4f;
  padding: 0;
  margin: 0;
}

.top-product__title-list {
  font-weight: 400;
  font-size: 16px;
  color: #2d2e36;
}

.top-product__list {
  font-weight: 400;
  font-size: 14px;
  color: #707279;
  padding-left: 14px;
}
</style>
