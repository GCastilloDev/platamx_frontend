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
    <img
      class="product-card__image"
      :src="defineImage(props.product)"
      alt=""
      v-if="!loading"
    />

    <section class="product-card__description" v-if="!loading">
      <p class="product-card__price">
        {{ converToCurrency(props.product.price) }}
      </p>
      <p class="product-card__title">
        {{ props.product.name }}
      </p>
      <p class="product-card__subtitle">{{ props.product.description }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const props = defineProps<{
  loading: boolean;
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    images?: [
      {
        url?: string;
      }
    ];
  };
}>();

function converToCurrency(price) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    currencyDisplay: "code",
  }).format(price);
}

function defineImage(product) {
  const image =
    "https://res.cloudinary.com/dhils8jyq/image/upload/v1725562192/plata_generico_on9yy1.jpg";

  if (product.images.length > 0) return product.images[0].url;

  return image;
}

function goToProduct() {
  const id = props.product.id;
  router.push({
    name: "product",
    params: {
      id,
    },
  });
}
</script>

<style scoped>
.product-card__container {
  height: 474px;
  width: 288px;
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
  width: 100%;
  height: 360px;
  object-fit: cover;
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
