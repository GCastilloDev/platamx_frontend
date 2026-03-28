<template>
  <q-page>
    <section class="order__container">
      <!-- Estado de Carga -->
      <div v-if="loading" class="q-py-xl text-center">
        <q-spinner color="black" size="3em" />
      </div>
      
      <!-- Estado de Error / Vacío -->
      <div v-else-if="!order" class="q-py-xl text-center">
        <div class="text-h6 text-grey-8 font-switzer">Ops, no se pudo localizar este pedido.</div>
        <q-btn flat class="q-mt-lg custom-btn" label="Regresar a mi perfil" @click="goBack" />
      </div>
      
      <!-- Vista Principal del Pedido -->
      <div v-else class="order__wrapper">
        <!-- Flecha de Regreso posicionada afuera del bloque central -->
        <div class="back-button-wrapper">
          <q-icon name="arrow_back" size="md" class="cursor-pointer icon-back" @click="goBack" />
        </div>

        <div class="order__content">
          <h1 class="order__title q-mb-xl">Fecha: {{ formatDate(order.datePurchase) }}</h1>

          <!-- Tabla Transparente de Productos -->
        <div class="order__table q-mb-xl">
          <!-- Titulos de Tabla -->
          <div class="row q-pb-md order__header">
            <div class="col-2"></div>
            <div class="col-6">Producto</div>
            <div class="col-4 text-right">Precio</div>
          </div>
          
          <!-- Iteración Viva de Artículos -->
          <div class="row q-py-lg order__row" v-for="item in order.items" :key="item.id">
            <div class="col-2 text-center self-center">
              <q-img :src="item.image" loading="lazy" class="order__image" />
            </div>
            <div class="col-6 self-center q-pl-sm order__product-name">
              {{ item.productName }}
            </div>
            <div class="col-4 self-center text-right order__cost">
              {{ converToCurrency(item.total) }} MXN
            </div>
          </div>
        </div>

        <!-- Segmento Total y Resumen de Costos -->
        <div class="order__summary q-mt-xl">
          <h2 class="order__summary-title q-mb-lg">Total del carrito</h2>
          
          <div class="row q-py-md order__summary-row">
            <div class="col-6 summary__label">Subtotal</div>
            <div class="col-6 text-right summary__value">{{ converToCurrency(order.subTotal) }} MXN</div>
          </div>
          
          <div class="row q-py-md order__summary-row">
            <div class="col-6 summary__label">Envío</div>
            <div class="col-6 text-right summary__value">{{ converToCurrency(order.deliveryCost) }} MXN</div>
          </div>
          
          <div class="row q-py-md order__summary-row">
            <div class="col-6 summary__label">Total</div>
            <div class="col-6 text-right summary__value">{{ converToCurrency(order.total) }} MXN</div>
          </div>
          
          <!-- Dirección de entrega adaptativa -->
          <div class="row q-py-lg order__summary-row" style="border-bottom: 1px solid #e3e4eb;">
            <div class="col-3 summary__label">Dirección de entrega</div>
            <div class="col-9 text-right summary__address">{{ order.deliveryAddress }}</div>
          </div>
        </div>
        
        </div> <!-- Cierra order__content -->
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiAuth } from "../boot/axios";

// Instancias de Quasar 
const route = useRoute();
const router = useRouter();

// Variables Reactivas 
const order = ref<any>(null);
const loading = ref(true);

// ---------------- Helpers Internacionalizados ----------------
function converToCurrency(price: any) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
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
  // En lugar de window.history.back(), inyectamos el ruteo hacia el Tab correcto por seguridad.
  router.push({ name: 'profile', query: { tab: 'purchases' } });
}

// Inicialización de Pantalla
onMounted(() => {
  fetchOrder();
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

.back-button-wrapper {
  position: absolute;
  left: 0;
  top: 5px;
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

.order__title {
  font-family: "Switzer-Variable", serif; /* Usando tu genérico porque las fechas son muy geométricas */
  font-weight: 700;
  font-size: 36px;
  color: #2F3033;
  margin: 0;
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
</style>
