<template>
  <section class="collection__container">
    <h2 class="collection__title">{{ t('collections_title') }}</h2>
    <h3 class="collection__subtitle">
      {{ t('collections_subtitle') }}
    </h3>

    <div class="collection__sections">
      <q-img
        class="collection__sections--images img__one"
        :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039753/Copia_de_CATALOGO_OCTUBRE_2023_Tama%C3%B1o_original_dlp2sw.jpg', 'f_auto,q_auto')"
        :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039753/Copia_de_CATALOGO_OCTUBRE_2023_Tama%C3%B1o_original_dlp2sw.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
        spinner-color="grey"
      />
      <q-img
        class="collection__sections--images img__two"
        :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039752/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_pwbqnb.jpg', 'f_auto,q_auto')"
        :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039752/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_pwbqnb.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
        spinner-color="grey"
      />
      <q-img
        class="collection__sections--images img__three"
        :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039753/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_vc0o5d.jpg', 'f_auto,q_auto')"
        :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039753/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_vc0o5d.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
        spinner-color="grey"
      />
      <q-img
        class="collection__sections--images img__four"
        :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039752/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_-_167_e7uea2.jpg', 'f_auto,q_auto')"
        :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039752/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_-_167_e7uea2.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
        spinner-color="grey"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getCloudinaryUrl } from '../utils/cloudinary';
const { t } = useI18n();
</script>

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

@media (max-width: 1024px) {
  .collection__title {
    font-size: 32px;
  }
  .collection__subtitle {
    font-size: 16px;
  }
  .collection__sections {
    padding-left: 20px;
    padding-right: 20px;
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
  .img__one, .img__two, .img__three, .img__four {
    grid-column: 1;
    grid-row: auto;
  }
}
</style>
