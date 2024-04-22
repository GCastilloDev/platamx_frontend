<template>
  <section class="collection__container">
    <h2 class="collection__title">Nuestras colecciones</h2>
    <h3 class="collection__subtitle">
      Buen gusto y prestigio siempre a la vanguardia
    </h3>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.collection__container {
  padding-top: 40px;
}

.collection__title,
.collection__subtitle {
  text-align: center;
  padding: 0;
  margin: 0;
}
.collection__title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 48px;
  color: #2f3033;
  letter-spacing: calc(48px * 0.03);
}

.collection__subtitle {
  margin-top: 15px;
  font-size: 18px;
  line-height: 23.4px;
  font-weight: 400;
  letter-spacing: calc(18px * 0.03);
}
</style>
