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
        <account />
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

import ShopBag from "../components/icons/ShopBag.vue";
import Account from "../components/icons/Account.vue";

const searchQ = ref("");
const prueba = ref({});

const router = useRouter();
const menu = ref([
  {
    id: -1,
    title: "Inicio",
    expand: false,
  },
]);

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
  console.log("entre");

  router.push({
    name: "search",
    query: {
      q: searchQ.value,
    },
  });

  searchQ.value = "";
  prueba.value.prueba.blur();
}

getCollections();
</script>

<style>
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
