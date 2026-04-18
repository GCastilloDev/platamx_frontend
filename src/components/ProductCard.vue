<template>
  <div class="product-card__container" @click="goToProduct()">
    <q-card flat style="max-height: 100%" v-if="loading">
      <q-skeleton height="360px" square animation="fade" />

      <q-card-section>
        <q-skeleton type="text" class="text-subtitle2" animation="fade" />
        <q-skeleton
          type="text"
          width="50%"
          class="text-subtitle2"
          animation="fade"
        />
      </q-card-section>
    </q-card>
    <template v-if="!loading && product">
      <q-img
        class="product-card__image"
        :src="getCloudinaryUrl(defineImage(props.product), 'w_400,f_auto,q_auto')"
        :placeholder-src="getCloudinaryUrl(defineImage(props.product), 'w_50,e_blur:1000,f_auto,q_auto')"
        spinner-color="grey"
        alt=""
      />

      <section class="product-card__description">
        <p class="product-card__price">
          {{ locale === 'en-US'
            ? converToCurrency(props.product.price_usd ?? props.product.price, 'USD')
            : converToCurrency(props.product.price, 'MXN') }}
        </p>
        <p class="product-card__title">
          {{ locale === 'en-US' ? (props.product.name_en || props.product.name) : props.product.name }}
        </p>
        <p class="product-card__subtitle">{{ stripHTML(locale === 'en-US'
          ? (props.product.description_en || props.product.description)
          : props.product.description) }}</p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useI18n } from 'vue-i18n';
import { formatCurrency } from "../utils/currency";
import { getCloudinaryUrl } from "../utils/cloudinary";

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

const props = defineProps<{
  loading: boolean;
  product?: {
    id: number;
    name: string;
    name_en?: string;
    description: string;
    description_en?: string;
    price: string | number;
    price_usd?: string | number;
    images?: [
      {
        url?: string;
      }
    ];
  } | null;
}>();

function converToCurrency(price: string | number, currency: 'MXN' | 'USD' = 'MXN') {
  return formatCurrency(price, currency);
}

function stripHTML(html?: string) {
  if (!html) return "";
  // Expresión regular compatible con SSR (Sin usar DOMParser)
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

function defineImage(product?: any) {
  const image =
    "https://res.cloudinary.com/dhils8jyq/image/upload/v1725562192/plata_generico_on9yy1.jpg";

  if (product && product.images && product.images.length > 0) return product.images[0].url;

  return image;
}

function goToProduct() {
  if (!props.product) return;
  const id = props.product.id;
  const lang = route.params.lang || 'es';
  router.push({
    name: "product",
    params: { id, lang },
  });
}
</script>

<style scoped>
.product-card__container {
  height: 474px;
  width: 288px;
  min-width: 288px;
  border-radius: 8px;
  border: 1px solid #e3e4eb;
  cursor: pointer;
}

.product-card__description {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
}
.product-card__image {
  background-color: #0a0a0a;
  width: 100%;
  height: 360px;
  object-fit: contain;
  border-radius: 8px 8px 0 0;
}

.product-card__price {
  padding: 0;
  margin: 0;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
  color: #2d2e36;
}

/* .product-card__price::before {
  content: "$";
  margin-right: 7px;
} */

.product-card__title {
  padding: 0;
  margin: 0;
  margin-bottom: 5px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 14px;
  line-height: 18.2px;
  letter-spacing: calc(14px * 0.03);
  color: #4f4f4f;
}

.product-card__subtitle {
  padding: 0;
  margin: 0;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  font-size: 12px;
  line-height: 15.6px;
  letter-spacing: calc(12px * 0.03);
  color: #707279;
}
</style>
