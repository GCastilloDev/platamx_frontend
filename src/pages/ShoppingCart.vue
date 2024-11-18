<template>
  <section class="container">
    <h2 class="title">Tu carrito</h2>
    <div class="text-center text-h5" v-if="products.length == 0">
      Sin productos seleccionados
    </div>
    <div class="products__cart">
      <div class="products__container" v-if="products.length > 0">
        <div class="row q-pt-lg q-pb-lg border">
          <div class="col-1"></div>
          <div class="col-2 table__title text-center">Cantidad</div>
          <div class="col-4 table__title">Producto</div>
          <div class="col-3 table__title">Precio</div>
          <div class="col-2"></div>
        </div>
        <div class="row q-pt-lg q-pb-lg border" v-for="product in products">
          <div class="col-1">
            <img class="product__image" :src="product.imageUrl" alt="" />
          </div>
          <div class="col-2 self-center text-center table__product-title">
            {{ product.quantity }}
          </div>
          <div class="col-4 table__product-title self-center">
            {{ product.nameItem }}
          </div>
          <div class="col-3 self-center table__product-price">
            {{
              new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                currencyDisplay: "symbol",
              }).format(product.total)
            }}
            MXN
          </div>
          <div class="col-2 text-center self-center">
            <q-icon name="delete"></q-icon>
          </div>
        </div>
        <h2>Total del carrito</h2>
        <div class="row table__row border">
          <div class="col-6 table__info">Subtotal</div>
          <div class="col-6 text-right table__price">
            {{
              new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                currencyDisplay: "symbol",
              }).format(subtotal)
            }}
            MXN
          </div>
        </div>
        <div class="row table__row border">
          <div class="col-6 table__info">Envío</div>
          <div class="col-6 text-right table__price">
            {{
              new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                currencyDisplay: "symbol",
              }).format(shipping)
            }}
            MXN
          </div>
        </div>
        <div class="row table__row border">
          <div class="col-6 table__info">Total</div>
          <div class="col-6 text-right table__price">
            {{
              new Intl.NumberFormat("es-MX", {
                style: "currency",
                currency: "MXN",
                currencyDisplay: "symbol",
              }).format(total)
            }}
            MXN
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { apiAuth } from "../boot/axios";

const api = apiAuth();
const products = ref([]);
const subtotal = ref("$0.00 MXN");
const shipping = ref("$0.00 MXN");
const total = ref("$0.00 MXN");

async function getShoppingCart() {
  try {
    const { data: response } = await api.get("/shopping-cart/user");
    subtotal.value = response.data.subTotal;
    shipping.value = response.data.deliveryCost;
    total.value = response.data.total;
    products.value = response.data.items;
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

getShoppingCart();
</script>

<style scoped>
.container {
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 50px;
}

.title {
  color: #2d2e36;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 44px;
  letter-spacing: calc(44px * 0.003);
}
.products__container {
  max-width: 767px;
  margin: auto;
}

.product__image {
  width: 64px;
  border-radius: 5px;
  margin: auto;
}

.table__title {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 18px;
  color: #707279;
}

h2 {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 28px;
  color: #2d2e36;
}

.table__row {
  height: 70px;
  align-items: center;
}

.border {
  border-bottom: 1px solid #e3e4eb;
}

.table__info {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 16px;
  padding-left: 10px;
  color: #707279;
}

.table__price {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 16px;
  padding-right: 10px;
  color: #2f3033;
}

.table__product-title {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 18.2px;
  letter-spacing: calc(14px * 0.03);
  color: #4f4f4f;
}

.table__product-price {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  letter-spacing: calc(14px * 0.03);
  color: #2f3033;
}
</style>
