<template>
  <div class="product-card__container">
    <img
      class="product-card__image"
      src="../assets/images/Imagen de producto 04 652 x 630.jpg"
      alt=""
    />
    <section class="product-card__description">
      <p class="product-card__price">999.00 MXN</p>
      <p class="product-card__title">
        Solitario De Oro Amarillo Estilo mexicanos nacionaleis
      </p>
      <p class="product-card__subtitle">14K Con 20Pts De Diamante (Si) (H)</p>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.product-card__container {
  height: 474px;
  width: 288px;
  border-radius: 8px;
  border: 1px solid #e3e4eb;
}

.product-card__description {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
}
.product-card__image {
  width: 100%;
  height: 360px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.product-card__price {
  padding: 0;
  margin: 0;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #2d2e36;
}

.product-card__price::before {
  content: "$";
  margin-right: 7px;
}

.product-card__title {
  padding: 0;
  margin: 0;
  margin-bottom: 5px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 14px;
  line-height: 18.2px;
  letter-spacing: calc(14px * 0.03);
  color: #4f4f4f;
}

.product-card__subtitle {
  padding: 0;
  margin: 0;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  font-size: 12px;
  line-height: 15.6px;
  letter-spacing: calc(12px * 0.03);
  color: #707279;
}
</style>
