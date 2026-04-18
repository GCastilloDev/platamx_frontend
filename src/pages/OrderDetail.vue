<template>
  <q-page>
    <section class="order__container">
      <!-- Estado de Carga -->
      <div v-if="loading" class="q-py-xl text-center">
        <q-spinner color="black" size="3em" />
      </div>
      
      <!-- Estado de Error / Vacío -->
      <div v-else-if="!order" class="q-py-xl text-center">
        <div class="text-h6 text-grey-8 font-switzer">{{ t('order_detail_error_not_found') }}</div>
        <q-btn flat class="q-mt-lg custom-btn" :label="t('order_detail_back_to_profile')" @click="goBack" />
      </div>
      
      <!-- Vista Principal del Pedido -->
      <div v-else class="order__wrapper">
        <div class="order__content">
          <!-- Cabecera Limpia (Flecha + Título de Orden) -->
          <div class="row items-start q-mb-md order__header-row" style="flex-wrap: nowrap;">
            <q-icon name="arrow_back" size="md" class="cursor-pointer icon-back q-mr-md q-mt-xs" @click="goBack" />
            <h1 class="order__title q-my-none">
              {{ t('profile_table_order') }} {{ order.folio || '' }}
            </h1>
          </div>

          <!-- Metadatos de la Orden (Fecha, Status, Tracking) -->
          <div class="row items-center q-mb-xl q-pl-xl order__metadata" style="padding-left: 44px; margin-bottom: 64px;">
            <span class="text-grey-7 q-mr-md order__date" style="font-family: 'Switzer-Variable', serif; font-weight: 500; font-size: 15px;">
              {{ t('order_detail_date') }}: {{ formatDate(order.datePurchase) }}
            </span>

            <div v-if="order.shipment_status" class="row items-center order__status-tracker">
              <q-badge
                outline
                class="q-px-sm"
                style="font-family: 'Switzer-Variable', serif; font-weight: 500; font-size: 12px; height: 22px; border-radius: 4px;"
                :color="order.shipment_status === 'PENDING' ? 'orange' : (order.shipment_status === 'DELIVERED' ? 'blue' : 'green')"
              >
                {{ order.shipment_status === 'PENDING' ? t('profile_status_pending') : (order.shipment_status === 'DELIVERED' ? t('profile_status_delivered') : t('profile_status_shipped')) }}
              </q-badge>
              
              <a 
                v-if="order.tracking_url" 
                :href="order.tracking_url" 
                target="_blank" 
                class="q-ml-md tracking-link"
              >
                {{ t('order_detail_track_package') }}
                <q-icon name="open_in_new" size="14px" class="q-ml-xs"/>
              </a>
            </div>
          </div>

          <!-- Tabla Transparente de Productos -->
        <div class="order__table q-mb-xl">
          <!-- Titulos de Tabla -->
          <div class="row q-pb-md order__header">
            <div class="col-2"></div>
            <div class="col-6">{{ t('order_detail_product') }}</div>
            <div class="col-4 text-right">{{ t('order_detail_price') }}</div>
          </div>
          
          <!-- Iteración Viva de Artículos -->
          <div class="row q-py-lg order__row order__item-container" v-for="item in order.items" :key="item.id">
            <div class="col-2 text-center self-center order__item-image-col">
              <q-img :src="item.image" loading="lazy" class="order__image" />
            </div>
            <div class="col-6 self-center q-pl-sm order__product-name order__item-title-col">
              {{ locale === 'en-US' ? (item.productName_en || item.productName) : item.productName }}
            </div>
            <div class="col-4 self-center text-right order__cost order__item-price-col">
              {{ converToCurrency(order.payment_currency === 'USD' ? item.totalUsd : item.total, order.payment_currency) }} <span style="font-size: 14px; font-weight: 500; color: #707279">{{ order.payment_currency || 'MXN' }}</span>
            </div>
          </div>
        </div>

        <!-- Segmento Total y Resumen de Costos -->
        <div class="order__summary q-mt-xl">
          <h2 class="order__summary-title q-mb-lg">{{ t('cart_summary_title') }}</h2>
          
          <div class="row q-py-md order__summary-row">
            <div class="col-6 summary__label">{{ t('cart_subtotal') }}</div>
            <div class="col-6 text-right summary__value">{{ converToCurrency(order.payment_currency === 'USD' ? order.subTotalUsd : order.subTotal, order.payment_currency) }} <span style="font-size: 13px; font-weight: 500; color: #707279">{{ order.payment_currency || 'MXN' }}</span></div>
          </div>
          
          <div class="row q-py-md order__summary-row">
            <div class="col-6 summary__label">{{ t('cart_shipping') }}</div>
            <div class="col-6 text-right summary__value">{{ converToCurrency(order.payment_currency === 'USD' ? order.deliveryCostUsd : order.deliveryCost, order.payment_currency) }} <span style="font-size: 13px; font-weight: 500; color: #707279">{{ order.payment_currency || 'MXN' }}</span></div>
          </div>
          
          <div class="row q-py-md order__summary-row">
            <div class="col-6 summary__label">{{ t('cart_total') }}</div>
            <div class="col-6 text-right summary__value">{{ converToCurrency(order.payment_currency === 'USD' ? order.totalUsd : order.total, order.payment_currency) }} <span style="font-size: 13px; font-weight: 500; color: #707279">{{ order.payment_currency || 'MXN' }}</span></div>
          </div>
          
          <!-- Dirección de entrega adaptativa -->
          <div class="row q-py-lg order__summary-row order__address-row" style="border-bottom: 1px solid #e3e4eb;">
            <div class="col-3 summary__label order__address-label">{{ t('order_detail_address') }}</div>
            <div class="col-9 text-right summary__address order__address-value">{{ order.deliveryAddress }}</div>
          </div>
        </div>
        
        </div> <!-- Cierra order__content -->
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { apiAuth } from "../boot/axios";
import { useAuthStore } from "../stores/auth";

// Instancias de Quasar
const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();

// Variables Reactivas 
const order = ref<any>(null);
const loading = ref(true);

// ---------------- Helpers Internacionalizados ----------------
function converToCurrency(price: any, currency: string = "MXN") {
  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "es-MX", {
    style: "currency",
    currency: currency || "MXN",
    currencyDisplay: "symbol",
  }).format(price || 0);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
// -------------------------------------------------------------

async function fetchOrder() {
  try {
    loading.value = true;
    const { data: response } = await apiAuth().get(`orders/${route.params.id}`);
    order.value = response.data;
  } catch (error) {
    console.error("Error extrayendo datos del servidor (ID Pedido)", error);
  } finally {
    loading.value = false;
  }
}

function goBack() {
  router.push({ name: 'profile', query: { tab: 'purchases' } });
}

// Inicialización de Pantalla
onMounted(() => {
  fetchOrder();
});

watch(() => authStore.isLoggedIn, (loggedIn) => {
  if (loggedIn) fetchOrder();
});
</script>

<style scoped>
.order__container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 20px;
}

.order__wrapper {
  position: relative;
}

.order__content {
  max-width: 800px;
  margin: 0 auto;
}

.icon-back {
  color: #2F3033;
  transition: opacity 0.2s ease;
}
.icon-back:hover {
  opacity: 0.6;
}

.tracking-link {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 14px;
  color: #2F3033;
  text-decoration: underline;
  transition: color 0.2s ease;
}
.tracking-link:hover {
  color: #707279;
}

.order__title {
  font-family: "Switzer-Variable", serif;
  font-weight: 700;
  font-size: 32px;
  color: #2F3033;
  line-height: 1.2;
}

.order__header {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 15px;
  color: #707279;
  border-bottom: 1px solid #e3e4eb;
}

.order__row {
  border-bottom: 1px solid #e3e4eb;
}

.order__image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
  background-color: #0A0A0A; /* El Dark placeholder PlataMX */
}

.order__product-name {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 15px;
  color: #4F4F4F;
  line-height: 1.4;
  padding-right: 20px;
}

.order__cost {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 16px;
  color: #2F3033;
}

.order__summary {
  width: 100%;
}

.order__summary-title {
  font-family: "Switzer-Variable", serif;
  font-weight: 700;
  font-size: 24px;
  color: #2F3033;
  margin: 0;
}

.order__summary-row {
  border-top: 1px solid #e3e4eb;
}

.summary__label {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 15px;
  color: #707279;
}

.summary__value {
  font-family: "Switzer-Variable", serif;
  font-weight: 700;
  font-size: 15px;
  color: #2F3033;
}

.summary__address {
  font-family: "Switzer-Variable", serif;
  font-weight: 700;
  font-size: 14px;
  color: #2F3033;
  line-height: 1.6;
  max-width: 320px; /* Previene estiramiento en pantallas ultra anchas */
  margin-left: auto; /* Empuja el rectangulo del texto hasta la derecha */
}

.font-switzer {
  font-family: "Switzer-Variable", serif;
}

.custom-btn {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  background-color: #f4f4f4;
  border-radius: 8px;
  color: #2F3033 !important;
}

@media (max-width: 1024px) {
  .order__container {
    padding: 30px 20px;
  }
  .order__title {
    font-size: 26px;
    line-height: 1.3;
  }
  .order__metadata {
    padding-left: 0 !important;
    margin-bottom: 30px !important;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .order__header {
    display: none;
  }
  .order__item-container {
    display: grid;
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      "img title"
      "img price";
    gap: 10px;
    align-items: center;
  }
  .order__item-image-col {
    grid-area: img;
    width: 100%;
  }
  .order__item-title-col {
    grid-area: title;
    width: 100%;
    padding-left: 0 !important;
  }
  .order__item-price-col {
    grid-area: price;
    width: 100%;
    text-align: left;
  }
  .order__image {
    width: 100%;
    height: 80px;
  }
  .order__address-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .order__address-label {
    width: 100%;
    margin-bottom: 5px;
  }
  .order__address-value {
    width: 100%;
    margin-left: 0;
    text-align: left;
    max-width: 100%;
  }
  .order__status-tracker {
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }
}
</style>
