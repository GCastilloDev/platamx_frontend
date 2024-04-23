<template>
  <section class="collection__container">
    <h2 class="collection__title">Nuestras colecciones</h2>
    <h3 class="collection__subtitle">
      Buen gusto y prestigio siempre a la vanguardia
    </h3>

    <div class="collection__sections">
      <img
        class="collection__sections--images img__one"
        src="../assets/images/collection_1.jpg"
        alt=""
      />
      <img
        class="collection__sections--images img__two"
        src="../assets/images/collection_2.jpg"
        alt=""
      />
      <img
        class="collection__sections--images img__three"
        src="../assets/images/collection_3.jpg"
        alt=""
      />
      <img
        class="collection__sections--images img__four"
        src="../assets/images/collection_4.jpg"
        alt=""
      />
    </div>
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

.collection__sections {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 25px;
  padding-left: 60px;
  padding-right: 60px;
  margin-top: 35px;
}

.collection__sections--images {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.img__one {
  grid-column: 1/3;
  grid-row: 1;
}
.img__two {
  grid-column: 1;
  grid-row: 2;
}

.img__three {
  grid-column: 2/3;
  grid-row: 2;
}

.img__four {
  grid-column: 3/5;
  grid-row: 1/3;
}
</style>
