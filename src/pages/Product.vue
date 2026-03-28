<template>
  <div
    v-if="loading"
    style="margin-top: 50px; padding-left: 60px; padding-right: 60px"
  >
    <q-card flat class="row">
      <q-skeleton height="250px" square class="col-6" />

      <q-card-section class="col-6">
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
          {{ collection.name }}
          <q-tooltip v-if="collection.description" anchor="bottom middle" self="top middle" :offset="[0, 8]">
            {{ collection.description }}
          </q-tooltip>
        </div>
      </div>
      <h2 class="product__title">{{ product.name }}</h2>
      <p class="product__price">
        {{
          new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
            currencyDisplay: "code",
          }).format(product.price)
        }}
      </p>

      <section v-if="product.variants && product.variants.length > 0">
        <p class="product__subtitle">Tallas</p>
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
        <span v-if="!loadingBtn">Añadir al carrito</span>
        <q-spinner-tail v-if="loadingBtn" color="white" size="2em" />
      </a>

      <div class="product__description">
        <h3 class="product__subtitle">Detalle del producto</h3>
        <div class="product__text" v-html="product.description">
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

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

import Login from "../components/Login.vue";
import CreateAccount from "../components/CreateAccount.vue";
import { apiAuth } from "../boot/axios";

const $q = useQuasar();

const api = apiAuth();

const route = useRoute();
const loading = ref(true);
const loadingBtn = ref(false);
const fullscreen = ref(false);
const openLogin = ref(false);
const openCreateAccount = ref(false);
const isAddProduct = ref(false);
const addProductButton = ref(null);

const product = ref<any>({
  collections: [{ description: "Colección de dijes", id: 2, name: "Anillos" }],
  name: "Arracadas Huggies",
  price: "8599",
  variants: [],
  description:
    "Arracadas de plata 14k con zirconias Las arracadas siempre serán unas excelentes aliadas de las mujeres. No importa si el maquillaje es escaso o no se llevan más accesorios. Cuando las arracadas están presentes, el rostro de cualquier dama adquiere brillo y glamour. Adquiere estas arracadas de oro blanco y vístete para triunfar.",
  images: [
    {
      id: 58,
      file_name: "87_vuknuc",
      url: "http://res.cloudinary.com/dhils8jyq/image/upload/v1725327519/87_vuknuc.jpg",
    },
    {
      id: 59,
      file_name: "86_qlwdgo",
      url: "http://res.cloudinary.com/dhils8jyq/image/upload/v1725327519/86_qlwdgo.jpg",
    },
  ],
});

const slide = ref("87_vuknuc");
const selectedVariant = ref<any>(null);

async function getProduct() {
  try {
    loading.value = true;
    const idProduct = route.params.id;
    const url = `https://platamx-backend-1cvg.onrender.com/products/${idProduct}`;

    const { data: response } = await axios.get(url);
    if (response.data.images.length === 0) {
      response.data.images.push({
        id: 0,
        file_name: "default",
        url: "https://res.cloudinary.com/dhils8jyq/image/upload/v1725562192/plata_generico_on9yy1.jpg",
      });
    }
    slide.value = response.data.images[0].file_name;
    product.value = response.data;
    
    // Auto-seleccionar la primera variante si existen para no mandar nulos al carrito
    if (product.value.variants && product.value.variants.length > 0) {
      selectedVariant.value = product.value.variants[0].id;
    }
    
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

function addProduct() {
  loadingBtn.value = true;
  const existSession = localStorage.plataMX;

  if (existSession === undefined) {
    loadingBtn.value = false;
    isAddProduct.value = true;
    openLogin.value = true;
    return;
  }

  postProduct();
}

async function postProduct() {
  try {
    addProductButton.value?.setAttribute("disabled", "");
    if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent("cart-optimistic", { detail: { delta: 1 } }));

    const item = {
      productId: product.value.id,
      variantId: selectedVariant.value || 0,
      quantity: 1,
    };

    await api.post("/shopping-cart", item);
    $q.notify({
      message: "Producto añadido al carrito",
      color: "green",
    });
    if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent("cart-updated"));
  } catch (error) {
    if (typeof window !== "undefined")
      window.dispatchEvent(new CustomEvent("cart-optimistic", { detail: { delta: -1 } }));
    console.log(error);
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

getProduct();
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
</style>
