<template>
  <q-layout view="lHh Lpr lFf">
    <section class="promotion">
      <p class="promotion__text">
        Envío gratis 🔥 en compras mayores a $1000.00 MXN
      </p>
    </section>

    <section class="header-action">
      <img
        class="header-action__logo"
        src="../assets/images/plata_mx_logo.png"
        alt=""
        srcset=""
      />
      <div class="header-action__search">
        <q-input
          class="header-action__search--input"
          standout
          label="Buscar en toda la tienda"
        >
          <template v-slot:append>
            <q-icon name="search" color="#2f3033" />
          </template>
        </q-input>
      </div>
      <div class="header-action__icons">
        <shop-bag />
        <account />
      </div>
    </section>

    <section class="menu__container">
      <span class="menu__item" v-for="item in menu">
        {{ item.title }}
        <q-icon v-if="item.expand" name="expand_more"></q-icon>
      </span>
    </section>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import ShopBag from "../components/icons/ShopBag.vue";
import Account from "../components/icons/Account.vue";

const menu = [
  {
    title: "Inicio",
    expand: false,
  },
  {
    title: "Anillos",
    expand: true,
  },
  {
    title: "Cadenas",
    expand: true,
  },
  {
    title: "Esclavas",
    expand: true,
  },
  {
    title: "Dijes de Zirconia",
    expand: true,
  },
  {
    title: "Rosarios",
    expand: true,
  },
];
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
}
</style>
