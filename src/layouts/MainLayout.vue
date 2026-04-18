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
        <router-link :to="{ name: 'home' }">
          <img
            class="header-action__logo"
            src="../assets/images/plata_mx_logo.png"
            alt=""
            srcset=""
          />
        </router-link>
      </div>
      <div class="header-action__search">
        <q-input
          :ref="(el) => (prueba['prueba'] = el)"
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
          <q-badge v-if="cartTotalItems > 0" color="red" rounded floating>{{ cartTotalItems }}</q-badge>
        </div>
        <account class="icon__pointer" @click="openDialogLogin" />
      </div>
    </section>

    <section class="menu__container" :class="{ 'menu--open': isMenuOpen }" v-show="!$q.screen.lt.md || isMenuOpen">
      <span
        class="menu__item"
        v-for="(item, index) in menu"
        @click="goToSection(index)"
      >
        {{ locale === 'en-US' ? (item.title_en || item.title) : item.title }}
        <q-icon v-if="item.expand" name="expand_more"></q-icon>
      </span>
    </section>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <section class="footer__container">
    <div>
      <p class="footer__title">{{ t('footer_contact') }}</p>
      <p class="footer__list">
        <phone class="icon__info" />
        <a href="https://wa.link/zydit9" target="”_blank”"> +52 81 1079 0972</a>
      </p>
      <p class="footer__list">
        <email class="icon__info" />
        <a href="mailto:platam_mx0925@hotmail.com" target="”_blank”">
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
      <a href="https://www.facebook.com/PLATAMX21MX" target="”_blank”">
        <facebook
      /></a>
      <a href="https://www.instagram.com/platamx.925" target="”_blank”">
        <instagram
      /></a>
      <a href="https://www.tiktok.com/@platamx925" target="”_blank”">
        <tiktok
      /></a>
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
import axios from "axios";
import { ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from "vue-router";
import { useQuasar, useMeta } from "quasar";

import validationRules from "../rules";
import { apiAuth } from "../boot/axios";
import { API_BASE_URL } from "../constants/api";

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
import { globalCollections } from "../stores/globalCollections";

const { t, locale } = useI18n();
const $q = useQuasar();

useMeta(() => {
  return {
    title: 'Plata MX',
    titleTemplate: (title) => title === 'Plata MX' ? title : `${title} | Plata MX`,
    meta: {
      ogTitle: { property: 'og:title', content: 'Plata MX' }
    }
  };
});

const isMenuOpen = ref(false);
const loginButton = ref(null);
const createAccountButton = ref(null);
const loginForm = ref(null);
const accountCreateForm = ref(null);

const route = useRoute();

const rules = validationRules(t);
const searchQ = ref("");
const email = ref("");
const password = ref("");
const prueba = ref({});
const dialogLogin = ref(false);
const dialogCreateAccount = ref(false);
const dialogForgotPassword = ref(false);
const backdropFilter = ref("blur(5px) saturate(150%)");
const cartTotalItems = ref(0);

async function fetchCartItems() {
  if (typeof window === "undefined") return;
  if (!localStorage.plataMX) {
    cartTotalItems.value = 0;
    return;
  }
  try {
    const { data } = await apiAuth().get("shopping-cart/user");
    cartTotalItems.value = parseInt(data.data.totalItems, 10) || 0;
  } catch (error) {
    console.log("Error trayendo carrito:", error);
    cartTotalItems.value = 0;
  }
}

// Solo ejecutar en el cliente, NUNCA en Node SSR
onMounted(() => {
  fetchCartItems();
});

// Eventos de Windows para comunicación limpia entre componentes 
if (typeof window !== "undefined") {
  window.addEventListener("cart-updated", (event: any) => {
    if (event.detail && event.detail.totalItems !== undefined) {
      cartTotalItems.value = parseInt(event.detail.totalItems, 10) || 0;
    } else {
      fetchCartItems();
    }
  });

  window.addEventListener("cart-optimistic", (event: any) => {
    if (event.detail && event.detail.delta !== undefined) {
      cartTotalItems.value = Math.max(0, cartTotalItems.value + event.detail.delta);
    }
  });

  window.addEventListener("user-logout", () => {
    cartTotalItems.value = 0;
  });

  // Sesión expirada: el interceptor de axios emite este evento ante un 401
  window.addEventListener("auth-expired", () => {
    cartTotalItems.value = 0;
    dialogLogin.value = true;
  });
}

function onLoginClose() {
  dialogLogin.value = false;
  fetchCartItems();
}
const iconPassword = ref("visibility");
const iconPasswordConfirm = ref("visibility");
const typeInputPassword = ref("password");
const typeInputPasswordConfirm = ref("password");
const loading = ref(false);
const user = ref({
  name: "",
  email: "",
  password: "",
  password_comfirm: "",
});

const router = useRouter();
const menu = ref([
  {
    id: -1,
    title: 'Inicio',
    title_en: 'Home',
    expand: false,
  },
]);

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
  if (!sessionExists()) {
    dialogLogin.value = true;
    return;
  }

  router.push({
    name: "profile",
    params: { lang: route.params.lang || 'es' },
  });
}

function goToShoppingCart() {
  router.push({
    name: "shopping-cart",
    params: { lang: route.params.lang || 'es' },
  });
}

function sessionExists() {
  return localStorage.plataMX !== undefined;
}

function goToSection(index: number) {
  isMenuOpen.value = false;
  const idSection = menu.value[index].id;
  const item = menu.value[index];
  const nameSection = locale.value === 'en-US'
    ? (item.title_en || item.title)
    : item.title;
  const lang = route.params.lang || 'es';

  if (idSection != -1) {
    router.push({
      name: "collection",
      params: {
        id: idSection,
        name: nameSection,
        lang,
      },
    });
    return;
  }

  router.push({
    name: "home",
    params: { lang },
  });
}

function getCollections() {
  try {
    // Vaciar todo excepto el item inicial ("Inicio") si es que Vue vuelve a montar
    menu.value = menu.value.filter(m => m.id === -1);
    
    globalCollections.value.forEach((e: any) => {
      const item = {
        id: e.id,
        title: e.title,
        title_en: e.title_en,
        expand: false,
      };

      menu.value.push(item);
    });
  } catch (error) {
    console.log(error);
  }
}
getCollections();

function search() {
  router.push({
    name: "search",
    query: {
      q: searchQ.value,
    },
  });

  searchQ.value = "";
  prueba.value.prueba.blur();
}

async function login() {
  try {
    loginButton.value?.setAttribute("disabled", "");
    loading.value = true;
    const url = `${API_BASE_URL}/auth/login`;

    const data = {
      email: email.value,
      password: password.value,
    };
    const { data: response } = await axios.post(url, data);
    const token = response.data.access_token;
    saveToken(token);
    dialogLogin.value = false;
    $q.notify("Sesión iniciada correctamente");
  } catch (error) {
    $q.notify({
      message: "Usuario y/o contraseña incorrectos",
      color: "red",
    });
    console.log(error);
  } finally {
    email.value = "";
    password.value = "";
    loginButton.value?.removeAttribute("disabled");
    loading.value = false;
  }
}

function saveToken(token: string) {
  const data = {
    token,
  };
  localStorage.setItem("plataMX", JSON.stringify(data));
}

function closeCreateAccount() {
  for (const property in user.value) {
    user.value[property] = "";
  }

  iconPassword.value = "visibility";
  iconPasswordConfirm.value = "visibility";
  typeInputPassword.value = "password";
  typeInputPasswordConfirm.value = "password";
  dialogCreateAccount.value = false;
}

function changeIcon() {
  if (iconPassword.value === "visibility") {
    iconPassword.value = "visibility_off";
    typeInputPassword.value = "text";
    return;
  }
  if (iconPassword.value === "visibility_off") {
    iconPassword.value = "visibility";
    typeInputPassword.value = "password";
    return;
  }
}

function changeIconConfirm() {
  if (iconPasswordConfirm.value === "visibility") {
    iconPasswordConfirm.value = "visibility_off";
    typeInputPasswordConfirm.value = "text";
    return;
  }
  if (iconPasswordConfirm.value === "visibility_off") {
    iconPasswordConfirm.value = "visibility";
    typeInputPasswordConfirm.value = "password";
    return;
  }
}

function closeLogin() {
  password.value = "";
  email.value = "";
  iconPassword.value = "visibility";
  typeInputPassword.value = "password";
  dialogLogin.value = false;
}

function loginValidate() {
  loginForm.value.validate().then((success) => {
    if (success) {
      login();
    }
  });
}

function createAccountValidate() {
  accountCreateForm.value.validate().then((success) => {
    if (success) {
      createAccount();
    }
  });
}

async function createAccount() {
  try {
    createAccountButton.value?.setAttribute("disabled", "");
    loading.value = true;
    const url = `${API_BASE_URL}/users`;

    await axios.post(url, user.value);
    dialogCreateAccount.value = false;
    $q.notify("Cuenta creada correctamente");
    dialogLogin.value = true;
  } catch (error) {
    console.log(error);
    $q.notify({
      message: "Error al crear la cuenta",
      color: "red",
    });
  } finally {
    for (const property in user.value) {
      user.value[property] = "";
    }
    createAccountButton.value?.removeAttribute("disabled");
    loading.value = false;
  }
}

getCollections();
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
