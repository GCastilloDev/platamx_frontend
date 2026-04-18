<template>
  <section class="hero__container">
    <div class="hero__signature"><h1>{{ t('hero_badge') }}</h1></div>
    <h2 class="hero__title">{{ t('hero_title1') }}</h2>
    <h2 class="hero__title">{{ t('hero_title2') }}</h2>
    <div class="hero__message">
      <h3>{{ t('hero_desc1') }}</h3>
      <h3>{{ t('hero_desc2') }}</h3>
    </div>
    <div class="hero__button">
      <button>
        <span>{{ t('hero_cta') }}</span>
      </button>
    </div>
  </section>

  <!-- Desktop Grid -->
  <section class="hero__images desktop-only">
    <!-- LCP image: native img for fetchpriority support -->
    <img
      class="hero__image hero__image--lcp"
      :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_gkatue.jpg', 'w_600,f_auto,q_auto')"
      fetchpriority="high"
      loading="eager"
      alt="Joyería Plata MX"
    />
    <q-img
      class="hero__image"
      :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_ru0lwt.jpg', 'w_600,f_auto,q_auto')"
      :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_ru0lwt.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
      spinner-color="grey"
    />
    <q-img
      class="hero__image"
      :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_sgxyts.jpg', 'w_600,f_auto,q_auto')"
      :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_sgxyts.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
      spinner-color="grey"
    />
  </section>

  <!-- Mobile Carousel -->
  <section class="mobile-only q-mt-lg">
    <q-carousel
      v-model="slide"
      swipeable
      animated
      infinite
      autoplay
      navigation
      height="500px"
      class="bg-transparent"
    >
      <q-carousel-slide :name="1" class="q-pa-none">
        <!-- LCP image on mobile: native img for fetchpriority support -->
        <img
          class="hero__image hero__image--lcp"
          :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_gkatue.jpg', 'w_500,f_auto,q_auto')"
          fetchpriority="high"
          loading="eager"
          alt="Joyería Plata MX"
        />
      </q-carousel-slide>
      <q-carousel-slide :name="2" class="q-pa-none">
        <q-img
          class="hero__image"
          :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_ru0lwt.jpg', 'w_500,f_auto,q_auto')"
          :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_ru0lwt.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
          spinner-color="grey"
        />
      </q-carousel-slide>
      <q-carousel-slide :name="3" class="q-pa-none">
        <q-img
          class="hero__image"
          :src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_sgxyts.jpg', 'w_500,f_auto,q_auto')"
          :placeholder-src="getCloudinaryUrl('https://res.cloudinary.com/dhils8jyq/image/upload/v1726039551/Copia_de_CATALOGO_ENERO_2024_Tama%C3%B1o_original_sgxyts.jpg', 'w_50,e_blur:1000,f_auto,q_auto')"
          spinner-color="grey"
        />
      </q-carousel-slide>
    </q-carousel>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { getCloudinaryUrl } from '../utils/cloudinary';

const { t } = useI18n();
const slide = ref(1);
</script>

<style lang="scss" scoped>
.hero__container {
  padding: 80px 60px 0px 60px;
}

.desktop-only {
  display: grid;
}
.mobile-only {
  display: none;
}

.hero__images {
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 512px;
  grid-gap: 15px;
  position: relative;
  margin-top: 35px;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__image--lcp {
  display: block;
}

.hero__signature,
.hero__button {
  display: flex;
  justify-content: center;
}
.hero__signature > h1 {
  display: inline;
  background-color: #f8f8f8;
  color: #4f4f4f;
  letter-spacing: 1px;
  border-radius: 12px;
  padding: 2px 16px;
  font-size: 12px;
  line-height: 16.8px;
  margin: 0px;
  margin-bottom: 10px;
}

.hero__title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 64px;
  line-height: 76.8px;
  text-align: center;
  color: #2d2e36;
  margin: 0px;
}

.hero__message {
  margin-top: 15px;
}
.hero__message > h3 {
  font-size: 18px;
  line-height: 25.2px;
  text-align: center;
  margin: 0px;
}

.hero__button > button {
  margin-top: 20px;
  width: 260px;
  height: 50px;
  border-radius: 360px;
  padding: 2px 16px;
  background-color: #2f3033;
  color: #ffff;
  font-size: 16px;
  letter-spacing: 1px;
}

@media (max-width: 1024px) {
  .hero__container {
    padding: 40px 20px 0px 20px;
  }
  .hero__title {
    font-size: clamp(26px, 9vw, 36px);
    line-height: 1.2;
    padding-left: 10px;
    padding-right: 10px;
  }
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
  }
  .hero__images {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(300px, auto);
  }
}

</style>
