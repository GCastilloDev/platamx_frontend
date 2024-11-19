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
        <div
          class="row q-pt-lg q-pb-lg border"
          v-for="(product, index) in products"
        >
          <div class="col-1">
            <img class="product__image" :src="product.imageUrl" alt="" />
          </div>
          <div
            class="col-2 self-center justify-center table__product-title prueba"
          >
            <q-btn
              flat
              round
              size="xs"
              icon="remove"
              :disable="product.quantity <= 1"
              @click="updateProduct(index, 'remove')"
            ></q-btn>
            {{ product.quantity }}
            <q-btn
              flat
              round
              size="xs"
              icon="add"
              @click="updateProduct(index, 'add')"
            ></q-btn>
          </div>
          <div class="col-4 table__product-title self-center q-pr-lg">
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
            <q-btn
              flat
              round
              size="sm"
              icon="delete"
              @click="deleteProduct(product.shoppingCartItemId)"
            ></q-btn>
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

        <section class="text-center q-mt-lg">
          <a class="product__btn" @click="purchase">
            <span>Finalizar compra</span>
          </a>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { apiAuth } from "../boot/axios";

const api = apiAuth();
const products = ref([]);
const subtotal = ref("$0.00 MXN");
const shipping = ref("$0.00 MXN");
const total = ref("$0.00 MXN");

const $q = useQuasar();

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

async function updateProduct(index, action) {
  try {
    $q.loading.show();
    const productID = products.value[index].shoppingCartItemId;
    let quantity = products.value[index].quantity;

    if (action === "remove") quantity--;
    if (action === "add") quantity++;

    const data = {
      quantity,
    };

    await api.patch(`shopping-cart/item/${productID}`, data);
    await getShoppingCart();
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
}

async function deleteProduct(productID) {
  try {
    $q.loading.show();
    await api.delete(`shopping-cart/item/${productID}`);
    await getShoppingCart();
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
}

async function purchase() {
  try {
    $q.loading.show();
    const data = {
      currencyPurchase: "MXN",
      urlSuccess: "string",
      urlCancel: "string",
    };

    const { data: response } = await api.post(
      "shopping-cart/purchase/checkout",
      data
    );

    const urlPayment = response.data.session_url;
    const element = document.createElement("a");
    // element.target = "_blank";
    element.href = urlPayment;
    element.click();
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
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

.product__btn {
  font-family: "Switzer-Variable", serif;
  font-size: 16px !important;
  text-align: center;
  width: 345px;
  height: 50px;
  background-color: #2f3033;
  border-radius: 360px;
  border: 1px solid #2f3033;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  padding: 12px 16px;
  text-decoration: none;
  margin-top: 20px;
  margin-bottom: 5px;
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

.prueba {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
