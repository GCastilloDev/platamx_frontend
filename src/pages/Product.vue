<template>
  <div
    v-if="loading"
    class="product__loading-container"
  >
    <q-card flat class="row">
      <q-skeleton height="250px" square class="col-12 col-md-6" />

      <q-card-section class="col-12 col-md-6">
        <q-skeleton
          animation="fade"
          type="QBadge"
          style="margin-bottom: 10px"
        />
        <q-skeleton animation="fade" type="rect" class="text-subtitle1" />
        <q-skeleton animation="fade" type="QBadge" style="margin-top: 10px" />
        <q-skeleton
          animation="fade"
          type="QChip"
          width="250px"
          height="40px"
          style="margin-top: 10px"
        />
        <q-skeleton
          type="text"
          class="text-subtitle2"
          animation="fade"
          style="margin-top: 10px"
        />
        <q-skeleton
          type="text"
          width="50%"
          class="text-subtitle2"
          animation="fade"
        />
      </q-card-section>
    </q-card>
  </div>

  <section v-if="!loading" class="product__container">
    <div class="product__section">
      <q-carousel
        swipeable
        animated
        v-model="slide"
        thumbnails
        infinite
        v-model:fullscreen="fullscreen"
      >
        <q-carousel-slide
          v-for="image in product.images"
          :name="image.file_name"
          :img-src="image.url"
        />

        <template v-slot:control>
          <q-carousel-control position="bottom-right" :offset="[18, 18]">
            <q-btn
              class="btn__zoom"
              round
              dense
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
        <!-- <q-carousel-slide
          :name="2"
          img-src="../assets/images/Imagen de producto 04 652 x 630.jpg"
        />
        <q-carousel-slide
          :name="3"
          img-src="../assets/images/Imagen de producto 07 652 x 631.jpg"
        />
        <q-carousel-slide
          :name="4"
          img-src="../assets/images/Imagen de producto 08 652 x 632.jpg"
        /> -->
      </q-carousel>
    </div>
    <div class="product__section">
      <div v-if="product.collections && product.collections.length > 0" class="product__tags-wrapper">
        <div
          class="product__tag"
          v-for="collection in product.collections"
          :key="collection.id"
        >
          {{ locale === 'en-US' ? (collection.name_en || collection.name) : collection.name }}
          <q-tooltip v-if="collection.description" anchor="bottom middle" self="top middle" :offset="[0, 8]">
            {{ locale === 'en-US' ? (collection.description_en || collection.description) : collection.description }}
          </q-tooltip>
        </div>
      </div>
      <h2 class="product__title">{{ locale === 'en-US' ? (product.name_en || product.name) : product.name }}</h2>
      <p class="product__price">
        {{ locale === 'en-US'
          ? formatCurrency(product.price_usd ?? product.price, 'USD')
          : formatCurrency(product.price, 'MXN') }}
      </p>

      <section v-if="product.variants && product.variants.length > 0">
        <p class="product__subtitle">{{ t('product_sizes') }}</p>
        <div class="product__size-container">
          <a
            v-for="variant in product.variants"
            :key="variant.id"
            href="#"
            class="product__size"
            :class="{ 'product__size_active': selectedVariant === variant.id }"
            @click.prevent="selectedVariant = variant.id"
          >
            {{ variant.name }}
          </a>
        </div>
      </section>
      <!-- <p>Conoce tu talla</p> -->
      <a class="product__btn" @click="addProduct" ref="addProductButton">
        <span v-if="!loadingBtn">{{ t('product_add_to_cart') }}</span>
        <q-spinner-tail v-if="loadingBtn" color="white" size="2em" />
      </a>

      <div class="product__description">
        <h3 class="product__subtitle">{{ t('product_detail_title') }}</h3>
        <div class="product__text" v-html="locale === 'en-US' ? (product.description_en || product.description) : product.description">
        </div>
      </div>
    </div>

    <Login
      :open="openLogin"
      :isAddProduct="isAddProduct"
      @close="closeLogin"
      @create-account="createAccountOpen"
    />
    <CreateAccount
      :open="openCreateAccount"
      @close="openCreateAccount = false"
      @open-login="openDialogLogin"
    />
  </section>
</template>

<script lang="ts">
import { useCurrentProductStore } from '../stores/currentProduct';

export default {
  async preFetch({ store, currentRoute }) {
    const productStore = useCurrentProductStore(store);
    await productStore.fetchProduct(currentRoute.params.id as string);
  }
}
</script>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar, useMeta } from "quasar";
import { useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';

import Login from "../components/Login.vue";
import CreateAccount from "../components/CreateAccount.vue";
import { apiAuth } from "../boot/axios";
import { getBackendError } from "../utils/error";
import { useAuth } from "../composables/useAuth";
import { useCart } from "../composables/useCart";
import { getCloudinaryUrl } from "../utils/cloudinary";
import { formatCurrency } from "../utils/currency";

const { t, locale } = useI18n();
const $q = useQuasar();

const api = apiAuth();
const { isLoggedIn } = useAuth();
const cartStore = useCart();

const route = useRoute();
const productStore = useCurrentProductStore();
const { product, loading, error } = storeToRefs(productStore);

const loadingBtn = ref(false);
const fullscreen = ref(false);
const openLogin = ref(false);
const openCreateAccount = ref(false);
const isAddProduct = ref(false);
const addProductButton = ref<any>(null);

const slide = ref(product.value?.images?.[0]?.file_name || "default");
const selectedVariant = ref<any>(product.value?.variants?.[0]?.id || null);

// If the product changes (e.g. CSR navigation), update defaults
watchEffect(() => {
  if (product.value) {
    if (!slide.value || slide.value === 'default') {
       slide.value = product.value.images?.[0]?.file_name || "default";
    }
    if (!selectedVariant.value && product.value.variants && product.value.variants.length > 0) {
       selectedVariant.value = product.value.variants[0].id;
    }
  }
});

useMeta(() => {
  if (!product.value) return { title: 'Plata MX' };
  
  const productName = locale.value === 'en-US' ? (product.value.name_en || product.value.name) : product.value.name;
  const productDesc = locale.value === 'en-US' ? (product.value.description_en || product.value.description) : product.value.description;
  const cleanDesc = productDesc ? productDesc.replace(/<[^>]*>?/gm, '').substring(0, 160) : '';
  const firstImage = product.value.images && product.value.images.length > 0 ? product.value.images[0].url : '';
  
  // Apply Cloudinary crop transformation for social media sharing
  const ogImageUrl = firstImage && firstImage.includes("cloudinary.com") 
    ? getCloudinaryUrl(firstImage, "w_1200,h_630,c_fill,f_auto,q_auto")
    : firstImage || 'icons/favicon-128x128.png';

  return {
    title: productName ? `${productName} | Plata MX` : 'Plata MX',
    meta: {
      description: { name: 'description', content: cleanDesc },
      ogTitle:     { property: 'og:title', content: productName },
      ogDesc:      { property: 'og:description', content: cleanDesc },
      ogImage:     { property: 'og:image', content: ogImageUrl },
      ogImageWidth:{ property: 'og:image:width', content: '1200' },
      ogImageHeight:{ property: 'og:image:height', content: '630' },
      twCard:      { name: 'twitter:card', content: 'summary_large_image' },
      twTitle:     { name: 'twitter:title', content: productName },
      twDesc:      { name: 'twitter:description', content: cleanDesc },
      twImage:     { name: 'twitter:image', content: ogImageUrl }
    }
  };
});

function addProduct() {
  loadingBtn.value = true;
  if (!isLoggedIn.value) {
    loadingBtn.value = false;
    isAddProduct.value = true;
    openLogin.value = true;
    return;
  }
  postProduct();
}

async function postProduct() {
  if (!product.value) return;
  
  try {
    addProductButton.value?.setAttribute("disabled", "");
    cartStore.addDelta(1);
    const item = {
      productId: product.value.id,
      variantId: selectedVariant.value || 0,
      quantity: 1,
    };
    await api.post("/shopping-cart", item);
    $q.notify({ message: t('product_added_ok'), color: "green" });
  } catch (err) {
    cartStore.addDelta(-1);
    console.log(err);
    $q.notify({
      message: getBackendError(err, "Ocurrió un error al agregar el producto al carrito."),
      color: "negative",
    });
  } finally {
    addProductButton.value?.removeAttribute("disabled");
    loadingBtn.value = false;
  }
}

function closeLogin() {
  isAddProduct.value = false;
  openLogin.value = false;
}

function openDialogLogin() {
  openCreateAccount.value = false;
  isAddProduct.value = true;
  openLogin.value = true;
}

function createAccountOpen() {
  closeLogin();
  openCreateAccount.value = true;
}
</script>

<style scoped>
.product__container {
  margin-left: 60px;
  margin-right: 60px;
  display: flex;
  gap: 40px;
  margin-top: 50px;
  margin-bottom: 50px;
}

.product__section {
  width: 50%;
}

.product-card__image {
  width: 100%;
}

.product__btn {
  font-family: "Switzer-Variable", serif;
  font-size: 16px !important;
  text-align: center;
  width: 260px;
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

.product__size-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.product__size {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Switzer-Variable", serif;
  font-size: 12px;
  line-height: 1.2;
  color: #707279;
  text-align: center;
  min-width: 87px;
  width: auto;
  min-height: 41px;
  height: auto;
  background-color: #f4f4f4;
  border-radius: 360px;
  border: 1px solid #f4f4f4;
  cursor: pointer;
  padding: 10px 16px;
  text-decoration: none;
}

.product__size_active {
  background-color: #2f3033;
  color: #ffffff;
}

.product__size_disabled {
  color: #e3e4eb;
  cursor: not-allowed;
}

.product__tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.product__tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: "Switzer-Variable", serif;
  font-size: 12px;
  line-height: 1.2;
  color: #707279;
  text-align: center;
  min-width: 72px;
  width: auto;
  min-height: 23px;
  height: auto;
  background-color: #f4f4f4;
  border-radius: 360px;
  border: 1px solid #f4f4f4;
  padding: 5px 16px;
  white-space: nowrap;
  cursor: default;
}

.product__title {
  margin: 0;
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 44px;
  line-height: 57.2px;
  letter-spacing: calc(44px * 0.03);
  color: #2d2e36;
}

.product__price {
  font-family: "Switzer-Variable", serif;
  margin: 10px 0px;
  padding: 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 31.2px;
  letter-spacing: calc(24px * 0.03);
  color: #4f4f4f;
}

.product__subtitle {
  font-family: "Switzer-Variable", serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 20.8px;
  letter-spacing: calc(16px * 0.03);
  margin: 0px 0px 10px 0px;
  color: #4f4f4f;
}

.product__text {
  font-family: "Switzer-Variable", serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 19.6px;
  color: #707279;
  margin: 0;
}

.product__description {
  border-top: 1px solid #b6b6b6;
  border-bottom: 1px solid #b6b6b6;
  margin-top: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
}

.q-carousel__slide {
  background-color: #0a0a0a;
  background-size: contain;
  background-repeat: no-repeat;
}

.btn__zoom {
  background-color: #2f3033;
  color: #ffffff;
}

.product__loading-container {
  margin-top: 50px;
  padding-left: 60px;
  padding-right: 60px;
}

@media (max-width: 1024px) {
  .product__container {
    margin-left: 20px;
    margin-right: 20px;
    flex-direction: column;
    gap: 20px;
  }
  .product__section {
    width: 100%;
  }
  .product__title {
    font-size: 32px;
    line-height: 40px;
  }
  .product__btn {
    width: 100%;
    box-sizing: border-box;
  }
  .product__loading-container {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
