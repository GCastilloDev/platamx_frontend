<template>
  <section class="promotion__container">
    <img class="promotion__img" src="../assets/images/promocion.jpg" alt="" />
    <h2 class="promotion__title">
      {{ t('promo_title') }}
    </h2>
    <h3 class="promotion__subtitle">
      {{ t('promo_subtitle') }}
    </h3>
    <div class="promotion__button">
      <span>{{ t('promo_cta') }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped>
.promotion__container {
  margin-top: 100px;
  position: relative;
}
.promotion__img {
  width: 100%;
  object-fit: cover;
}

.promotion__title,
.promotion__subtitle,
.promotion__button {
  position: absolute;
  margin-left: 60px;
}
.promotion__title {
  top: 15%;
  width: 50%;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 44px;
  line-height: 57.2px;
  letter-spacing: calc(44px * 0.03);
  color: #f4f4f4;
}

.promotion__subtitle {
  top: 47%;
  width: 35%;
  font-weight: 400;
  font-size: 18px;
  line-height: 23.4px;
  letter-spacing: calc(18px * 0.03);
  color: #cfcfcf;
}

.promotion__button {
  top: 65%;
  width: 376px;
  height: 56px;
  padding: 14px 32px 14px 32px;
  background-color: #e3e4eb;
  border-radius: 360px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.promotion__button:hover {
  cursor: pointer;
}

.promotion__button span {
  color: #2f3033;
  font-weight: 500;
  font-size: 21px;
  line-height: 27.7px;
  letter-spacing: calc(21px * 0.035);
}

@media (max-width: 1024px) {
  .promotion__container {
    margin-top: 50px;
  }
  .promotion__img {
    height: 350px;
  }
  .promotion__title,
  .promotion__subtitle {
    margin-left: 20px;
    width: calc(100% - 40px);
  }

  .promotion__title {
    font-size: 28px;
    line-height: 36px;
    top: 15%;
  }
  .promotion__subtitle {
    font-size: 15px;
    line-height: 22px;
    top: 45%;
  }
  .promotion__button {
    margin-left: 20px;
    border-radius: 30px;
    top: 73%;
    padding: 10px 0px;
    height: 48px;
    width: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .promotion__button span {
    font-size: 16px;
  }
}
</style>
