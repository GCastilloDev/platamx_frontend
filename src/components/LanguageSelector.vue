<template>
  <div class="lang-selector">
    <span
      class="lang-selector__item"
      :class="{ 'lang-selector__item--active': currentLang === 'es' }"
      @click="setLang('es')"
    >ES</span>
    <span class="lang-selector__divider">|</span>
    <span
      class="lang-selector__item"
      :class="{ 'lang-selector__item--active': currentLang === 'en' }"
      @click="setLang('en')"
    >EN</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const currentLang = computed(() => route.params.lang as string || 'es');

function setLang(lang: 'es' | 'en') {
  if (lang === currentLang.value) return;
  // Navigate to same route but with new lang param
  router.push({
    name: route.name as string,
    params: { ...route.params, lang },
    query: route.query,
  });
}
</script>

<style scoped>
.lang-selector {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1;
  user-select: none;
}

.lang-selector__item {
  cursor: pointer;
  color: #2d2e36;
  opacity: 0.45;
  transition: opacity 0.2s ease, font-weight 0.15s ease;
  padding: 2px 0;
}

.lang-selector__item:hover {
  opacity: 0.75;
}

.lang-selector__item--active {
  opacity: 1;
  font-weight: 700;
  border-bottom: 1.5px solid #2d2e36;
}

.lang-selector__divider {
  color: #2d2e36;
  opacity: 0.25;
  font-weight: 300;
  font-size: 11px;
}
</style>


<style scoped>
.lang-selector {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.8px;
  line-height: 1;
  user-select: none;
}

.lang-selector__item {
  cursor: pointer;
  color: #2d2e36;
  opacity: 0.45;
  transition: opacity 0.2s ease, font-weight 0.15s ease;
  padding: 2px 0;
}

.lang-selector__item:hover {
  opacity: 0.75;
}

.lang-selector__item--active {
  opacity: 1;
  font-weight: 700;
  border-bottom: 1.5px solid #2d2e36;
}

.lang-selector__divider {
  color: #2d2e36;
  opacity: 0.25;
  font-weight: 300;
  font-size: 11px;
}
</style>
