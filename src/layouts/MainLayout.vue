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
