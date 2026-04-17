<template>
  <section class="container">
    <h2 class="title">{{ t('cart_title') }}</h2>

    <!-- Estado de carga inicial -->
    <div v-if="loadingCart" class="text-center q-py-xl">
      <q-spinner color="black" size="3em" />
    </div>

    <template v-else>
      <div class="text-center text-h5" v-if="products.length == 0">
        {{ t('cart_empty') }}
      </div>
      <div class="products__cart">
        <div class="products__container" v-if="products.length > 0">
          <div class="row q-pt-lg q-pb-lg border">
            <div class="col-1"></div>
            <div class="col-2 table__title text-center">{{ t('cart_col_qty') }}</div>
            <div class="col-4 table__title">{{ t('cart_col_product') }}</div>
            <div class="col-3 table__title">{{ t('cart_col_price') }}</div>
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
              {{ locale === 'en-US' ? (product.nameItem_en || product.nameItem) : product.nameItem }}
            </div>
            <div class="col-3 self-center table__product-price">
              {{ formatPrice(product.total, product.totalUsd) }}
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
          <h2>{{ t('cart_summary_title') }}</h2>
          <div class="row table__row border">
            <div class="col-6 table__info">{{ t('cart_subtotal') }}</div>
            <div class="col-6 text-right table__price">
              {{ formatPrice(subtotal, subtotalUsd) }}
            </div>
          </div>
          <div class="row table__row border">
            <div class="col-6 table__info">{{ t('cart_shipping') }}</div>
            <div class="col-6 text-right table__price">
              {{ formatPrice(shipping, shippingUsd) }}
            </div>
          </div>
          <div class="row table__row border">
            <div class="col-6 table__info">{{ t('cart_total') }}</div>
            <div class="col-6 text-right table__price">
              {{ formatPrice(total, totalUsd) }}
            </div>
          </div>

          <section class="text-center q-mt-lg">
            <a class="product__btn" @click="purchase">
              <span>{{ t('cart_checkout') }}</span>
            </a>
          </section>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from 'vue-i18n';
import { apiAuth } from "../boot/axios";

const { t, locale } = useI18n();
const api = apiAuth();
const products = ref<any[]>([]);
const subtotal = ref<any>(0);
const shipping = ref<any>(0);
const total = ref<any>(0);
const subtotalUsd = ref<any>(0);
const shippingUsd = ref<any>(0);
const totalUsd = ref<any>(0);
const loadingCart = ref(true);

const $q = useQuasar();

function formatPrice(priceMxn: any, priceUsd: any) {
  const isEn = locale.value === 'en-US';
  const currency = isEn ? 'USD' : 'MXN';
  const price = isEn ? (priceUsd ?? priceMxn) : priceMxn;
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  const formatted = new Intl.NumberFormat(isEn ? 'en-US' : 'es-MX', {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  }).format(numericPrice || 0);
  
  return `${formatted} ${currency}`;
}

async function getShoppingCart() {
  const dispatch = (event: string, detail?: object) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(event, detail ? { detail } : undefined),
      );
    }
  };
  try {
    loadingCart.value = true;
    const { data: response } = await api.get("/shopping-cart/user");

    // Guardián contra el Backend que avienta `{}` cuando la canasta se quedó huérfana
    if (!response.data || Object.keys(response.data).length === 0) {
      subtotal.value = 0;
      shipping.value = 0;
      total.value = 0;
      products.value = [];

      dispatch("cart-updated", { totalItems: 0 });
      return;
    }

    subtotal.value = response.data.subTotal;
    shipping.value = response.data.deliveryCost;
    total.value = response.data.total;
    subtotalUsd.value = response.data.subTotalUsd;
    shippingUsd.value = response.data.deliveryCostUsd;
    totalUsd.value = response.data.totalUsd;
    products.value = response.data.items;

    // Empujar evento al root pero con Maletín Inteligente para evitarle gastar red
    dispatch("cart-updated", { totalItems: response.data.totalItems });
  } catch (error) {
    console.log(error);
  } finally {
    loadingCart.value = false;
  }
}

async function updateProduct(index, action) {
  const productID = products.value[index].shoppingCartItemId;
  const previousQuantity = products.value[index].quantity;
  let quantity = previousQuantity;

  if (action === "remove") quantity--;
  if (action === "add") quantity++;

  const delta = action === "add" ? 1 : -1;
  const data = { quantity };

  // Engaño visual
  products.value[index].quantity = quantity;
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("cart-optimistic", { detail: { delta } }),
    );

  try {
    $q.loading.show();
    await api.patch(`shopping-cart/item/${productID}`, data);
    await getShoppingCart();
  } catch (error) {
    products.value[index].quantity = previousQuantity;
    if (typeof window !== "undefined")
      window.dispatchEvent(
        new CustomEvent("cart-optimistic", { detail: { delta: -delta } }),
      );
    console.log(error);
  } finally {
    $q.loading.hide();
  }
}

async function deleteProduct(productID) {
  const prodIndex = products.value.findIndex(
    (p) => p.shoppingCartItemId === productID,
  );
  if (prodIndex === -1) return;

  const prevProd = products.value[prodIndex];
  const delta = -prevProd.quantity;

  // Engaño visual
  products.value.splice(prodIndex, 1);
  if (typeof window !== "undefined")
    window.dispatchEvent(
      new CustomEvent("cart-optimistic", { detail: { delta } }),
    );

  try {
    $q.loading.show();
    await api.delete(`shopping-cart/item/${productID}`);
    await getShoppingCart();
  } catch (error) {
    products.value.splice(prodIndex, 0, prevProd);
    if (typeof window !== "undefined")
      window.dispatchEvent(
        new CustomEvent("cart-optimistic", { detail: { delta: -delta } }),
      );
    console.log(error);
  } finally {
    $q.loading.hide();
  }
}

async function purchase() {
  try {
    $q.loading.show();
    const lang = locale.value === 'en-US' ? 'en' : 'es';
    const data = {
      currencyPurchase: locale.value === 'en-US' ? 'USD' : 'MXN',
      urlSuccess: `${lang}/profile?tab=purchases`,
      urlCancel: "string",
    };

    const { data: response } = await api.post(
      "shopping-cart/purchase/checkout",
      data,
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
