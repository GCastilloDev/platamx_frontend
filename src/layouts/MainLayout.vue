<template>
  <q-layout view="lHh Lpr lFf">
    <section class="promotion">
      <p class="promotion__text">
        Envío gratis 🔥 en compras mayores a $1000.00 MXN
      </p>
    </section>

    <section class="header-action">
      <router-link :to="{ name: 'home' }">
        <img
          class="header-action__logo"
          src="../assets/images/plata_mx_logo.png"
          alt=""
          srcset=""
        />
      </router-link>
      <div class="header-action__search">
        <q-input
          :ref="(el) => (prueba['prueba'] = el)"
          v-model:model-value="searchQ"
          class="header-action__search--input"
          standout
          label="Buscar en toda la tienda"
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
        <shop-bag />
        <account class="icon__pointer" @click="dialogLogin = true" />
      </div>
    </section>

    <section class="menu__container">
      <span
        class="menu__item"
        v-for="(item, index) in menu"
        @click="goToSection(index)"
      >
        {{ item.title }}
        <q-icon v-if="item.expand" name="expand_more"></q-icon>
      </span>
    </section>

    <!-- Login -->
    <q-dialog
      v-model="dialogLogin"
      persistent
      :backdrop-filter="backdropFilter"
    >
      <q-card style="width: 420px">
        <q-card-section class="text-right q-pb-none">
          <q-icon
            @click="closeLogin"
            class="icon__close"
            name="close"
            color="black"
            size="28px"
          ></q-icon>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="login__title">Inicio de sesión</div>
        </q-card-section>
        <q-form ref="loginForm">
          <q-card-section>
            <p class="input__title">Correo electrónico</p>
            <q-input
              :autofocus="true"
              standout
              v-model="email"
              type="email"
              placeholder="ejemplo@hotmail.com"
              stack-label
              :rules="rules.email"
            >
            </q-input>
          </q-card-section>
          <q-card-section>
            <p class="input__title">Contraseña</p>
            <q-input
              :type="typeInputPassword"
              placeholder="•••••••"
              standout
              v-model="password"
              :rules="rules.password"
            >
              <template v-slot:append>
                <q-icon
                  style="cursor: pointer"
                  @click="changeIcon"
                  :name="iconPassword"
                />
              </template>
            </q-input>
          </q-card-section>
        </q-form>

        <q-card-actions align="center">
          <span class="login__button" @click="loginValidate" ref="loginButton">
            <span v-if="!loading">Iniciar Sesión</span>
            <q-spinner-tail v-if="loading" color="white" size="2em" />
          </span>
        </q-card-actions>
        <q-card-section>
          <p class="login__create-account">
            ¿No tienes cuenta?
            <span @click="openCreateAccount">Regístrate</span>
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Create Account -->
    <q-dialog
      v-model="dialogCreateAccount"
      persistent
      :backdrop-filter="backdropFilter"
    >
      <q-card style="width: 420px">
        <q-card-section class="text-right q-pb-none">
          <q-icon
            @click="closeCreateAccount"
            class="icon__close"
            name="close"
            color="black"
            size="28px"
          ></q-icon>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="login__title">Regístrate</div>
        </q-card-section>
        <q-form ref="accountCreateForm">
          <q-card-section>
            <p class="input__title">Nombre completo</p>
            <q-input
              :autofocus="true"
              standout
              v-model="user.name"
              type="text"
              placeholder="Arturo Salinas Nuñez"
              stack-label
              :rules="rules.required"
            >
            </q-input>
          </q-card-section>
          <q-card-section>
            <p class="input__title">Correo electrónico</p>
            <q-input
              :autofocus="true"
              standout
              v-model="user.email"
              type="email"
              placeholder="ejemplo@hotmail.com"
              stack-label
              :rules="rules.email"
            >
            </q-input>
          </q-card-section>
          <q-card-section>
            <p class="input__title">Contraseña</p>
            <q-input
              :type="typeInputPassword"
              placeholder="•••••••"
              standout
              v-model="user.password"
              :rules="rules.password"
            >
              <template v-slot:append>
                <q-icon
                  style="cursor: pointer"
                  @click="changeIcon"
                  :name="iconPassword"
                />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <p class="input__title">Confirmar contraseña</p>
            <q-input
              :type="typeInputPasswordConfirm"
              placeholder="•••••••"
              standout
              v-model="user.password_comfirm"
              :rules="rules.confirmPassword(user.password)"
            >
              <template v-slot:append>
                <q-icon
                  style="cursor: pointer"
                  @click="changeIconConfirm"
                  :name="iconPasswordConfirm"
                />
              </template>
            </q-input>
          </q-card-section>
        </q-form>

        <q-card-actions align="center">
          <span
            class="login__button"
            @click="createAccountValidate"
            ref="createAccountButton"
          >
            <span v-if="!loading">Registrarme</span>
            <q-spinner-tail v-if="loading" color="white" size="2em" />
          </span>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <section class="footer__container">
    <div>
      <p class="footer__title">Contacto</p>
      <p class="footer__list">800 202 8283</p>
      <p class="footer__list">clientes@plata.mx</p>
      <p class="footer__list">
        Camelia 2550-2560, Moderna, 64530 Monterrey, N.L
      </p>
    </div>
    <div>
      <p class="footer__title">Contacto</p>
      <p class="footer__list">Dijes de zirconia para mujer</p>
      <p class="footer__list">Cadenas de plata</p>
      <p class="footer__list">Anillos de promesa</p>
      <p class="footer__list">Esclavas</p>
      <p class="footer__list">Rosarios</p>
    </div>
    <div>
      <p class="footer__title">Siguenos en:</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";

import validationRules from "../rules";

import ShopBag from "../components/icons/ShopBag.vue";
import Account from "../components/icons/Account.vue";

const $q = useQuasar();
const loginButton = ref(null);
const createAccountButton = ref(null);
const loginForm = ref(null);
const accountCreateForm = ref(null);

const rules = validationRules();

const searchQ = ref("");
const email = ref("");
const password = ref("");
const prueba = ref({});
const dialogLogin = ref(false);
const dialogCreateAccount = ref(false);
const backdropFilter = ref("blur(5px) saturate(150%)");
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
    title: "Inicio",
    expand: false,
  },
]);

function openCreateAccount() {
  dialogLogin.value = false;
  dialogCreateAccount.value = true;
}

function goToSection(index: number) {
  const idSection = menu.value[index].id;
  const nameSection = menu.value[index].title;

  if (idSection != -1) {
    router.push({
      name: "collection",
      params: {
        id: idSection,
        name: nameSection,
      },
    });
    return;
  }

  router.push({
    name: "home",
  });
}

async function getCollections() {
  try {
    const url =
      "https://platamx-backend-98b7dd1a72e1.herokuapp.com/collections?page=1&items=25";
    const { data: response } = await axios.get(url);

    response.data.forEach((e: any) => {
      const item = {
        id: e.id,
        title: e.name,
        expand: false,
      };

      menu.value.push(item);
    });
  } catch (error) {
    console.log(error);
  }
}

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
    const url = "https://platamx-backend-98b7dd1a72e1.herokuapp.com/auth/login";

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
  localStorage.setItem("token", token);
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
    const url = "https://platamx-backend-98b7dd1a72e1.herokuapp.com/users";

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
  height: 44px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.promotion__text {
  margin: auto;
  line-height: 24px;
  font-size: 16px;
  color: #ffffff;
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
</style>
