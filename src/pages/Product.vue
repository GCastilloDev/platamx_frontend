<template>
  <section class="product__container">
    <!-- <div class="product__section">
      <img
        class="product-card__image"
        src="../assets/images/Imagen de producto 04 652 x 630.jpg"
        alt=""
      />
    </div> -->
    <div class="product__section">
      <q-carousel swipeable animated v-model="slide" thumbnails infinite>
        <q-carousel-slide
          :name="1"
          img-src="../assets/images/Imagen de producto 03 652 x 630.jpg"
        />
        <q-carousel-slide
          :name="2"
          img-src="../assets/images/Imagen de producto 04 652 x 630.jpg"
        />
        <q-carousel-slide
          :name="3"
          img-src="../assets/images/Imagen de producto 07 652 x 631.jpg"
        />
        <q-carousel-slide
          :name="4"
          img-src="../assets/images/Imagen de producto 08 652 x 632.jpg"
        />
      </q-carousel>
    </div>
    <div class="product__section">
      <div class="product__tag">Anillos</div>
      <h2 class="product__title">Arracadas Huggies</h2>
      <p class="product__price">$8,599.00 MXN</p>
      <p class="product__subtitle">Tamaño</p>
      <div class="product__size-container">
        <a class="product__size product__size_active" href="#">8</a>
        <a class="product__size" href="#">9</a>
        <a class="product__size product__size_disabled" href="#">10</a>
        <a class="product__size" href="#">11</a>
        <a class="product__size" href="#">12</a>
      </div>
      <!-- <p>Conoce tu talla</p> -->
      <a href="#" class="product__btn">
        <span>Añadir al carrito</span>
      </a>

      <div class="product__description">
        <h3 class="product__subtitle">Detalle del producto</h3>
        <p class="product__text">
          Arracadas de plata 14k con zirconias Las arracadas siempre serán unas
          excelentes aliadas de las mujeres. No importa si el maquillaje es
          escaso o no se llevan más accesorios. Cuando las arracadas están
          presentes, el rostro de cualquier dama adquiere brillo y glamour.
          Adquiere estas arracadas de oro blanco y vístete para triunfar.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const slide = ref(1);
</script>

<style scoped>
.product__container {
  margin-left: 60px;
  margin-right: 60px;
  display: flex;
  gap: 40px;
  margin-top: 50px;
  margin-bottom: 50px;
}

.product__section {
  width: 50%;
}

.product-card__image {
  width: 100%;
}

.product__btn {
  font-family: "Switzer-Variable", serif;
  font-size: 16px !important;
  text-align: center;
  width: 260px;
  height: 50px;
  background-color: #2f3033;
  border-radius: 360px;
  border: 1px solid #2f3033;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  padding: 12px 16px;
  text-decoration: none;
  margin-top: 20px;
  margin-bottom: 5px;
}

.product__size-container {
  display: flex;
  gap: 10px;
}
.product__size {
  display: inline-block;
  font-family: "Switzer-Variable", serif;
  font-size: 12px;
  color: #707279;
  text-align: center;
  width: 87px;
  height: 41px;
  background-color: #f4f4f4;
  border-radius: 360px;
  border: 1px solid #f4f4f4;
  display: inline-block;
  cursor: pointer;
  padding: 10px 16px;
  text-decoration: none;
}

.product__size_active {
  background-color: #2f3033;
  color: #ffffff;
}

.product__size_disabled {
  color: #e3e4eb;
  cursor: not-allowed;
}

.product__tag {
  display: inline-block;
  font-family: "Switzer-Variable", serif;
  font-size: 12px;
  color: #707279;
  text-align: center;
  width: 72px;
  height: 21px;
  background-color: #f4f4f4;
  border-radius: 360px;
  border: 1px solid #f4f4f4;
  padding: 0px 16px;
}

.product__title {
  margin: 0;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 44px;
  line-height: 57.2px;
  letter-spacing: calc(44px * 0.03);
  color: #2d2e36;
}

.product__price {
  font-family: "Switzer-Variable", serif;
  margin: 10px 0px;
  padding: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 31.2px;
  letter-spacing: calc(24px * 0.03);
  color: #4f4f4f;
}

.product__subtitle {
  font-family: "Switzer-Variable", serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 20.8px;
  letter-spacing: calc(16px * 0.03);
  margin: 0px 0px 10px 0px;
  color: #4f4f4f;
}

.product__text {
  font-family: "Switzer-Variable", serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.6px;
  color: #707279;
  margin: 0;
}

.product__description {
  border-top: 1px solid #b6b6b6;
  border-bottom: 1px solid #b6b6b6;
  margin-top: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
}
</style>
