<template>
  <q-layout view="lHh Lpr lFf">
    <section class="promotion">
      <p class="promotion__text">
        {{ t('promotion_banner') }}
      </p>
    </section>

    <section class="header-action">
      <div style="display: flex; align-items: center;">
        <q-btn v-if="$q.screen.lt.md" flat dense round icon="menu" @click="isMenuOpen = !isMenuOpen" class="q-mr-md" />
        <router-link :to="{ name: 'home', params: { lang: route.params.lang || 'es' } }" aria-label="Plata MX - Inicio">
          <img
            class="header-action__logo"
            src="../assets/images/plata_mx_logo.png"
            alt="Plata MX"
            width="257"
            height="48"
          />
        </router-link>
      </div>
      <div class="header-action__search">
        <q-input
          :ref="(el) => (searchInputRef['searchInputRef'] = el)"
          v-model:model-value="searchQ"
          class="header-action__search--input"
          standout
          :label="t('search_placeholder')"
          @keyup.enter="search()"
        >
          <template v-slot:append>
            <q-icon
              style="cursor: pointer"
              name="search"
              color="#2f3033"
              @click="search()"
            />
          </template>
        </q-input>
      </div>
      <div class="header-action__icons">
        <language-selector />
        <div class="cursor-pointer relative-position" style="display: inline-flex;" @click="goToShoppingCart">
          <shop-bag class="icon__pointer" />
          <q-badge v-if="totalItems > 0" color="red" rounded floating>{{ totalItems }}</q-badge>
        </div>
        <account class="icon__pointer" @click="openDialogLogin" />
      </div>
    </section>

    <section class="menu__container" :class="{ 'menu--open': isMenuOpen, 'menu--mobile-hidden': !isMenuOpen }">
      <span
        class="menu__item"
        v-for="(item, index) in menu"
        @click="goToSection(index)"
      >
        {{ locale === 'en-US' ? (item.title_en || item.title) : item.title }}
        <q-icon v-if="item.expand" name="expand_more"></q-icon>
      </span>
    </section>

    <q-page-container role="main">
      <router-view />
    </q-page-container>
  </q-layout>

  <section class="footer__container">
    <div>
      <p class="footer__title">{{ t('footer_contact') }}</p>
      <p class="footer__list">
        <phone class="icon__info" />
        <a href=”https://wa.link/zydit9” target=”_blank” rel=”noopener”> +52 81 1079 0972</a>
      </p>
      <p class=”footer__list”>
        <email class=”icon__info” />
        <a href=”mailto:platam_mx0925@hotmail.com”>
          platam_mx0925@hotmail.com</a
        >
      </p>
    </div>
    <div>
      <p class="footer__title">{{ t('footer_popular') }}</p>
      <p class="footer__list">Dijes de zirconia para mujer</p>
      <p class="footer__list">Cadenas de plata</p>
      <p class="footer__list">Anillos de promesa</p>
      <p class="footer__list">Esclavas</p>
      <p class="footer__list">Rosarios</p>
    </div>
    <div>
      <p class="footer__title">{{ t('footer_follow') }}</p>
      <a href=”https://www.facebook.com/PLATAMX21MX” target=”_blank” rel=”noopener” aria-label=”Visítanos en Facebook”>
        <facebook />
      </a>
      <a href=”https://www.instagram.com/platamx.925” target=”_blank” rel=”noopener” aria-label=”Síguenos en Instagram”>
        <instagram />
      </a>
      <a href=”https://www.tiktok.com/@platamx925” target=”_blank” rel=”noopener” aria-label=”Síguenos en TikTok”>
        <tiktok />
      </a>
    </div>

    <Login
      :open="dialogLogin"
      @close="onLoginClose"
      @createAccount="openCreateAccount"
      @forgotPassword="openForgotPassword"
    />

    <CreateAccount
      :open="dialogCreateAccount"
      @close="dialogCreateAccount = false"
      @openLogin="openLogin"
    />

    <ForgotPassword
      :open="dialogForgotPassword"
      @close="dialogForgotPassword = false"
    />
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from "vue-router";
import { useQuasar, useMeta } from "quasar";

import { apiAuth } from "../boot/axios";
import { useAuth } from "../composables/useAuth";
import { useCart } from "../composables/useCart";

import ShopBag from "../components/icons/ShopBag.vue";
import Account from "../components/icons/Account.vue";
import Facebook from "../components/icons/Facebook.vue";
import Instagram from "../components/icons/Instagram.vue";
import Tiktok from "../components/icons/Tiktok.vue";
import Email from "../components/icons/Email.vue";
import Phone from "../components/icons/Phone.vue";
import Login from "../components/Login.vue";
import CreateAccount from "../components/CreateAccount.vue";
import ForgotPassword from "../components/ForgotPassword.vue";
import LanguageSelector from "../components/LanguageSelector.vue";
import { useCollectionsStore } from "../stores/globalCollections";
import { storeToRefs } from "pinia";

const { t, locale } = useI18n();
const $q = useQuasar();
const { isLoggedIn, init: initAuth, logout } = useAuth();
const { totalItems, setTotal, reset: resetCart } = useCart();

const collectionsStore = useCollectionsStore();
const { collections } = storeToRefs(collectionsStore);

useMeta(() => {
  const metaDescription = 'Descubre la elegancia en Plata MX: tu tienda en línea de joyería exclusiva en auténtica plata fina 925. Catálogo premium, envíos seguros. ¡Compra hoy!';
  const ogImageUrl = 'https://res.cloudinary.com/dhils8jyq/image/upload/c_fill,g_center,w_1200,h_630,f_auto,q_auto/v1773097612/product/750001001/cadena-ojo-egipcio-de-oro-10k-italiano-_55cm-x-3mm_-2_krek6b.jpg';

  return {
    title: 'Plata MX',
    titleTemplate: (title) => title === 'Plata MX' ? title : `${title} | Plata MX`,
    meta: {
      description: { name: 'description', content: metaDescription },
      ogTitle: { property: 'og:title', content: 'Plata MX' },
      ogDesc: { property: 'og:description', content: metaDescription },
      ogImage: { property: 'og:image', content: ogImageUrl },
      ogImageWidth: { property: 'og:image:width', content: '1200' },
      ogImageHeight: { property: 'og:image:height', content: '630' },
      twCard: { name: 'twitter:card', content: 'summary_large_image' },
      twTitle: { name: 'twitter:title', content: 'Plata MX' },
      twDesc: { name: 'twitter:description', content: metaDescription },
      twImage: { name: 'twitter:image', content: ogImageUrl }
    }
  };
});

const route = useRoute();
const router = useRouter();
const isMenuOpen = ref(false);
const searchQ = ref("");
const searchInputRef = ref({});
const dialogLogin = ref(false);
const dialogCreateAccount = ref(false);
const dialogForgotPassword = ref(false);

const menu = computed(() => {
  const items = [{ id: -1, title: 'Inicio', title_en: 'Home', expand: false }];
  collections.value.forEach((e: any) => {
    items.push({ id: e.id, title: e.title, title_en: e.title_en, expand: false });
  });
  return items;
});

async function fetchCartItems() {
  if (typeof window === "undefined") return;
  if (!isLoggedIn.value) {
    setTotal(0);
    return;
  }
  try {
    const { data } = await apiAuth().get("shopping-cart/user");
    const items = data.data?.items ?? [];
    const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
    setTotal(count);
  } catch (error) {
    console.log("Error trayendo carrito:", error);
    setTotal(0);
  }
}

onMounted(() => {
  initAuth();
  fetchCartItems();
});

if (typeof window !== "undefined") {
  window.addEventListener("auth-expired", () => {
    logout();
    resetCart();
    dialogLogin.value = true;
  });
}

function onLoginClose() {
  dialogLogin.value = false;
  fetchCartItems();
}

function openLogin() {
  dialogCreateAccount.value = false;
  dialogLogin.value = true;
}

function openCreateAccount() {
  dialogLogin.value = false;
  dialogCreateAccount.value = true;
}

function openForgotPassword() {
  dialogLogin.value = false;
  dialogForgotPassword.value = true;
}

function openDialogLogin() {
  if (!isLoggedIn.value) {
    dialogLogin.value = true;
    return;
  }
  router.push({ name: "profile", params: { lang: route.params.lang || 'es' } });
}

function goToShoppingCart() {
  router.push({ name: "shopping-cart", params: { lang: route.params.lang || 'es' } });
}

function goToSection(index: number) {
  isMenuOpen.value = false;
  const item = menu.value[index];
  const lang = route.params.lang || 'es';
  const nameSection = locale.value === 'en-US' ? (item.title_en || item.title) : item.title;

  if (item.id !== -1) {
    router.push({ name: "collection", params: { id: item.id, name: nameSection, lang } });
    return;
  }
  router.push({ name: "home", params: { lang } });
}

function search() {
  router.push({ name: "search", query: { q: searchQ.value } });
  searchQ.value = "";
  searchInputRef.value.searchInputRef.blur();
}
</script>

<style>
a {
  color: #a7a7a7;
}

.icon__info {
  margin-right: 5px;
  width: 15px;
  height: 15px;
}

.login__title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  color: #2d2e36;
}

.login__button {
  cursor: pointer;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  width: 260px;
  height: 50px;
  border-radius: 360px;
  color: #ffffff;
  background-color: #2f3033;
}

.login__button > span {
  font-size: 16px;
  font-weight: 400;
}

.login__create-account {
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  color: #2f3033;
}

.login__create-account > span {
  cursor: pointer;
  text-decoration: underline;
}

.icon__close {
  cursor: pointer;
  padding-bottom: 0;
}

.input__title {
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #2d2e36;
  padding: 0;
}

.icon__pointer {
  cursor: pointer;
}

.promotion {
  background-color: #2f3033;
  min-height: 44px;
  height: auto;
  font-size: 16px;
  display: flex;
  align-items: center;
  padding: 8px 15px;
}

.promotion__text {
  margin: auto;
  line-height: 1.4;
  font-size: 15px;
  color: #ffffff;
  text-align: center;
}

.header-action {
  display: grid;
  grid-template-columns: 3fr 10fr 3fr;
  align-items: end;
  padding: 0px 50px 0px 50px;
  margin-top: 15px;
}

.header-action__logo {
  width: 230px;
}

.header-action__search {
  display: flex;
  justify-content: center;
}

.header-action__search--input {
  width: 90%;
}

.header-action__icons {
  height: 100%;
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: end;
}

.menu__container {
  display: flex;
  justify-content: center;
  gap: 4px;
  padding-bottom: 3px;
  border-bottom: 1px solid #e8e9ef;
}

.menu--mobile-hidden {
  display: none;
}

@media (min-width: 1025px) {
  .menu--mobile-hidden {
    display: flex;
  }
}

.menu__item {
  padding: 12px 24px 12px 24px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #2d2e36;
  letter-spacing: 1px;
  cursor: pointer;
}

.footer__container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 70px;
  padding-bottom: 70px;
  background-color: #222222;
  margin-top: 50px;
}

.footer__container > div {
  width: 25%;
}

.footer__title {
  font-family: "Playfair Display", serif;
  font-weight: 700;
  font-size: 26px;
  line-height: 36px;
  color: #f4f4f4;
}

.footer__list {
  font-family: "Switzer-Variable", serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 27.72px;
  color: #a7a7a7;
  margin: 0;
  padding: 0;
}

@media (max-width: 1024px) {
  .header-action {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas: 
      "left right"
      "search search";
    padding: 10px 20px;
    column-gap: 5px;
    row-gap: 15px;
    align-items: center;
  }
  .header-action > div:nth-child(1) {
    grid-area: left;
    display: flex;
    align-items: center;
  }
  .header-action__logo {
    width: 100%;
    max-width: 130px;
  }
  .header-action__search {
    grid-area: search;
    width: 100%;
  }
  .header-action__search--input {
    width: 100%;
  }
  .header-action__icons {
    grid-area: right;
    justify-content: flex-end;
    gap: 8px;
  }

  .menu__container {
    flex-direction: column;
    align-items: center;
    border-bottom: none;
    padding-top: 15px;
    display: none; /* Hidden by default on mobile */
  }
  
  .menu--open {
    display: flex; /* Shown when open */
  }
  .menu__item {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #e8e9ef;
  }

  .footer__container {
    padding: 40px 20px;
    flex-direction: column;
    gap: 30px;
  }
  .footer__container > div {
    width: 100%;
  }
}
</style>
