<template>
  <section class="container">
    <div class="row q-col-gutter-xl">
      <div class="col-12 col-md-3">
        <div class="profile-menu-wrapper q-pt-none">
          <div
            class="profile-menu-tab cursor-pointer row items-center"
            :class="{ 'profile-menu-tab--active': tab === 'account' }"
            @click="
              tab = 'account';
              tabEvent('account');
            "
          >
            {{ t('profile_my_account') }}
          </div>
          <div
            class="profile-menu-tab cursor-pointer row items-center"
            :class="{ 'profile-menu-tab--active': tab === 'purchases' }"
            @click="
              tab = 'purchases';
              tabEvent('purchases');
            "
          >
            {{ t('profile_purchases') }}
          </div>
          <div
            class="profile-menu-tab cursor-pointer row items-center"
            :class="{ 'profile-menu-tab--active': tab === 'exit' }"
            @click="tabEvent('exit')"
          >
            {{ t('profile_sign_out') }}
          </div>
        </div>
      </div>

      <div class="col-12 col-md-9 q-pl-xl">
        <q-tab-panels
          v-model="tab"
          animated
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="account" class="q-pa-none">
            <section class="row q-mb-lg items-start">
              <div class="col-12 col-md-3 profile__title q-mt-md">{{ t('profile_name_label') }}</div>
              <div class="col-12 col-md-7">
                <q-card flat bordered class="rounded-borders">
                  <q-card-section v-if="loadingProfile">
                    <q-skeleton style="width: 100%" type="text" />
                  </q-card-section>
                  <transition name="elegant-fade" mode="out-in">
                    <q-card-section v-if="!loadingProfile && !isEditingName" key="readName" class="q-pa-lg q-py-xl">
                      <div class="row justify-between items-center">
                        <div class="col-8 profile-card-content">
                          {{ userProfile.name }}
                        </div>
                        <div class="col-auto text-right">
                          <span class="profile-card-link cursor-pointer" @click="attemptChangeName">{{ t('profile_change') }}</span>
                        </div>
                      </div>
                    </q-card-section>

                    <!-- MODO EDICIÓN FORMULARIO NOMBRE -->
                    <q-card-section v-else-if="!loadingProfile && isEditingName" key="editName" class="q-pa-lg">
                      <q-form @submit="saveName">
                        <p class="input__title q-mb-sm">{{ t('profile_name_full') }}</p>
                        <q-input outlined v-model="formName" :rules="rules.maxLength200" placeholder="" class="q-mb-lg custom-input-border" />
                        
                        <div class="row q-mt-lg items-center form-buttons-container">
                          <button
                            class="login__button form-btn-save"
                            type="submit"
                            style="outline: none; border: none; font-family: 'Switzer-Variable', Switzer, serif; width: auto; padding: 0 32px;"
                            :disabled="loadingSaveName"
                          >
                            <span v-if="!loadingSaveName">{{ t('profile_save') }}</span>
                            <q-spinner-tail v-if="loadingSaveName" color="white" size="20px" />
                          </button>
                          <span
                            class="btn-cancel-form q-ml-xl cursor-pointer form-btn-cancel"
                            @click="closeNameModal"
                          >
                             {{ t('profile_cancel') }}
                          </span>
                        </div>
                      </q-form>
                    </q-card-section>
                  </transition>
                </q-card>
              </div>
            </section>

            <section class="row q-mb-lg items-start">
              <div class="col-12 col-md-3 profile__title q-mt-md">
                {{ t('profile_address_label') }}
              </div>
              <div class="col-12 col-md-7">
                <q-card flat bordered class="rounded-borders">
                  <q-card-section v-if="loadingProfile">
                    <q-skeleton style="width: 100%" type="text" />
                  </q-card-section>
                  <transition name="elegant-fade" mode="out-in">
                    <q-card-section v-if="!loadingProfile && !isEditingAddress" key="read" class="q-pa-lg q-py-xl">
                    <div class="row justify-between items-center">
                      <div class="col-8 profile-card-content">
                        <span v-if="userAddress !== null">
                          {{
                            userProfile.address.street ||
                            userProfile.address.streat
                          }}, {{ userProfile.address.city }}, C.P.
                          {{ userProfile.address.zip }}, Teléfono:
                          {{ userProfile.address.phone }}
                        </span>
                        <span v-else>{{ t('profile_no_address') }}</span>
                      </div>
                      <div class="col-auto text-right">
                        <span
                          class="profile-card-link cursor-pointer"
                          @click="openAddressModal"
                        >
                          {{ userAddress !== null ? t('profile_change') : t('profile_add') }}
                        </span>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-section v-else-if="!loadingProfile && isEditingAddress" key="edit" class="q-pa-lg">
                    <q-form ref="addressForm" @submit="saveAddress">
                      
                      <p class="input__title q-mb-sm">{{ t('profile_state') }}</p>
                      <q-input outlined v-model="formAddress.state" :rules="rules.maxLength200" placeholder="Por ejemplo: Nuevo León" class="q-mb-md custom-input-border" />
                      
                      <p class="input__title q-mb-sm">{{ t('profile_city') }}</p>
                      <q-input outlined v-model="formAddress.city" :rules="rules.maxLength200" placeholder="Por ejemplo: Monterrey" class="q-mb-md custom-input-border" />
                      
                      <p class="input__title q-mb-sm">{{ t('profile_street') }}</p>
                      <q-input outlined v-model="formAddress.street" :rules="rules.maxLength200" placeholder="Calle, número ext e int" class="q-mb-md custom-input-border" />
                      
                      <p class="input__title q-mb-sm">{{ t('profile_zip') }}</p>
                      <q-input outlined v-model="formAddress.zip" :rules="rules.zipcode" mask="#####" placeholder="Por ejemplo: 01000" class="q-mb-md custom-input-border" />
                      
                      <p class="input__title q-mb-sm">{{ t('profile_phone') }}</p>
                      <q-input outlined v-model="formAddress.phone" :rules="rules.phone" mask="##########" placeholder="" class="q-mb-lg custom-input-border" />
                      
                      <div class="row q-mt-lg items-center form-buttons-container">
                        <button
                          class="login__button form-btn-save"
                          type="submit"
                          style="outline: none; border: none; font-family: 'Switzer-Variable', Switzer, serif; width: auto; padding: 0 32px;"
                          :disabled="loadingSaveAddress"
                        >
                          <span v-if="!loadingSaveAddress">{{ t('profile_save') }}</span>
                          <q-spinner-tail v-if="loadingSaveAddress" color="white" size="20px" />
                        </button>
                        <span
                          class="btn-cancel-form q-ml-xl cursor-pointer form-btn-cancel"
                          @click="closeAddressModal"
                        >
                          {{ t('profile_cancel') }}
                        </span>
                      </div>
                    </q-form>
                  </q-card-section>
                  </transition>
                </q-card>
              </div>
            </section>

            <section class="row q-mb-lg items-start">
              <div class="col-12 col-md-3 profile__title q-mt-md">
                {{ t('profile_password_label') || 'Contraseña' }}
              </div>
              <div class="col-12 col-md-7">
                <q-card flat bordered class="rounded-borders">
                  <q-card-section v-if="loadingProfile">
                    <q-skeleton style="width: 100%" type="text" />
                  </q-card-section>
                  <transition name="elegant-fade" mode="out-in">
                    <q-card-section v-if="!loadingProfile && !isEditingPassword" key="readPass" class="q-pa-lg q-py-xl">
                      <div class="row justify-between items-center">
                        <div class="col-8 profile-card-content">
                          ••••••••••••
                        </div>
                        <div class="col-auto text-right">
                          <span class="profile-card-link cursor-pointer" @click="openPasswordModal">{{ t('profile_change') }}</span>
                        </div>
                      </div>
                    </q-card-section>

                    <q-card-section v-else-if="!loadingProfile && isEditingPassword" key="editPass" class="q-pa-lg">
                      <q-form ref="passwordForm" @submit="savePassword">
                        
                        <p class="input__title q-mb-sm">{{ t('profile_old_password') }}</p>
                        <q-input 
                          outlined 
                          v-model="formPassword.old_password" 
                          :type="showOldPass ? 'text' : 'password'" 
                          :rules="rules.required" 
                          class="q-mb-md custom-input-border"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="showOldPass ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="showOldPass = !showOldPass"
                            />
                          </template>
                        </q-input>

                        <p class="input__title q-mb-sm">{{ t('profile_new_password') }}</p>
                        <q-input 
                          outlined 
                          v-model="formPassword.new_password" 
                          :type="showNewPass ? 'text' : 'password'" 
                          :rules="rules.password" 
                          class="q-mb-md custom-input-border"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="showNewPass ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="showNewPass = !showNewPass"
                            />
                          </template>
                        </q-input>

                        <p class="input__title q-mb-sm">{{ t('profile_confirm_password') }}</p>
                        <q-input 
                          outlined 
                          v-model="formPassword.comfirm_password" 
                          :type="showConfirmPass ? 'text' : 'password'" 
                          :rules="rules.confirmPassword(formPassword.new_password)" 
                          class="q-mb-lg custom-input-border"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="showConfirmPass ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="showConfirmPass = !showConfirmPass"
                            />
                          </template>
                        </q-input>
                        
                        <div class="row q-mt-lg items-center form-buttons-container">
                          <button
                            class="login__button form-btn-save"
                            type="submit"
                            style="outline: none; border: none; font-family: 'Switzer-Variable', Switzer, serif; width: auto; padding: 0 32px;"
                            :disabled="loadingSavePassword"
                          >
                            <span v-if="!loadingSavePassword">{{ t('profile_save_password') || t('profile_save') }}</span>
                            <q-spinner-tail v-if="loadingSavePassword" color="white" size="20px" />
                          </button>
                          <span
                            class="btn-cancel-form q-ml-xl cursor-pointer form-btn-cancel"
                            @click="closePasswordModal"
                          >
                            {{ t('profile_cancel') }}
                          </span>
                        </div>
                      </q-form>
                    </q-card-section>
                  </transition>
                </q-card>
              </div>
            </section>
          </q-tab-panel>

          <q-tab-panel name="purchases">
            <section class="text-center q-py-xl" v-if="loadingOrders">
              <q-spinner color="black" size="3em" />
            </section>

            <section class="text-center text-h6 text-grey-8 q-mt-lg" v-else-if="userOrders.length === 0">
              {{ t('profile_orders_empty') }}
            </section>
            
            <!-- Compras Listado -->
            <section v-else class="purchases__container">
              <!-- Encabezados de tabla falsa -->
              <div class="row q-pb-sm text-left purchases__header">
                <div class="col-4">{{ t('profile_table_order') }}</div>
                <div class="col-3">{{ t('profile_table_date') }}</div>
                <div class="col-3">{{ t('profile_table_cost') }}</div>
                <div class="col-2">{{ t('profile_table_detail') }}</div>
              </div>

              <!-- Iteración de registros -->
              <div
                class="row q-py-lg purchases__row"
                v-for="order in userOrders"
                :key="order.id"
              >
                <!-- Col 1: ID -->
                <div class="col-12 col-md-4 q-pr-sm">
                  <div class="purchases__folio">{{ t('profile_table_order') }} {{ order.folio }}</div>
                  <div class="purchases__product-name ellipsis">{{ locale === 'en-US' ? (order.productName_en || order.productName) : order.productName }}</div>
                  <div class="flex items-center q-mt-sm">
                    <q-badge
                      outline
                      style="font-family: 'Switzer-Variable', serif;"
                      :color="order.shipment_status === 'PENDING' ? 'orange' : (order.shipment_status === 'DELIVERED' ? 'blue' : 'green')"
                    >
                      {{ order.shipment_status === 'PENDING' ? t('profile_status_pending') : (order.shipment_status === 'DELIVERED' ? t('profile_status_delivered') : t('profile_status_shipped')) }}
                    </q-badge>

                    <a 
                      v-if="order.tracking_url" 
                      :href="order.tracking_url" 
                      target="_blank" 
                      style="font-family: 'Switzer-Variable', serif; font-size: 13px; font-weight: 500; color: #2F3033; text-decoration: underline;"
                      class="q-ml-md tracking-link"
                    >
                      {{ t('order_detail_track_package') }} <q-icon name="open_in_new" size="12px" />
                    </a>
                  </div>
                </div>

                <!-- Col 2: Fecha -->
                <div class="col-12 col-md-3 q-mt-sm q-mt-md-none self-center purchases__date">
                  {{ formatDate(order.datePurchase) }}
                </div>

                <!-- Col 3: Costo (Moneda de Compra Real) -->
                <div class="col-12 col-md-3 q-mt-sm q-mt-md-none self-center purchases__cost">
                  {{ converToCurrency(order.payment_currency === 'USD' ? order.totalUsd : order.total, order.payment_currency) }} 
                  <span style="font-size: 14px; font-weight: 500; color: #707279">{{ order.payment_currency || 'MXN' }}</span>
                </div>

                <!-- Col 4: Action -->
                <div class="col-12 col-md-2 q-mt-md q-mt-md-none self-center text-center text-md-left">
                  <a href="#" class="purchases__action purchases__action--mobile-full" @click.prevent="router.push('/' + route.params.lang + '/order/' + order.id)">{{ t('profile_view_order') }}</a>
                </div>
              </div>
            </section>
          </q-tab-panel>

          <q-tab-panel name="exit">
            <div class="text-h4 q-mb-md">Movies</div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useQuasar } from "quasar";
import { apiAuth, apiNoAuth } from "../boot/axios";
import validationRules from "../rules";
import { getBackendError } from "../utils/error";
import { useI18n } from 'vue-i18n';

import { useRouter, useRoute } from "vue-router";

const { t, locale } = useI18n();
const rules = validationRules();
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const auth = apiAuth();
const tab = ref("account");
const splitterModel = ref("30");
const userProfile = ref<any>({});
const userOrders = ref<any[]>([]);
const userAddress = ref(null);
const loadingProfile = ref(true);
const loadingOrders = ref(false);

watch(() => route.query.tab, (newTab) => {
  if (newTab === "purchases") {
    tab.value = "purchases";
    getOrders();
  } else if (newTab === "account" || !newTab) {
    tab.value = "account";
    getProfile();
  }
});

onMounted(() => {
  if (route.query.tab === "purchases") {
    tab.value = "purchases";
    getOrders();
  } else {
    getProfile();
  }
  
  window.addEventListener('user-login', handleLogin);
});

onUnmounted(() => {
  window.removeEventListener('user-login', handleLogin);
});

function handleLogin() {
  if (tab.value === "purchases") {
    getOrders();
  } else if (tab.value === "account") {
    getProfile();
  }
}

async function tabEvent(event: string) {
  if (event !== "exit" && route.query.tab !== event) {
    router.replace({ query: { ...route.query, tab: event } });
  }

  if (event === "account") {
    getProfile();
    return;
  }

  if (event === "purchases") {
    getOrders();
    return;
  }

  if (event === "exit") {
    localStorage.clear();
    window.dispatchEvent(new CustomEvent("user-logout"));
    router.push({
      name: "home",
    });
    return;
  }
}

function validateAddress() {
  userAddress.value = null;
  const address = userProfile.value.address;
  let countProperties = 0;

  for (const property in address) {
    if (address[property] !== null) countProperties += 1;
  }

  if (countProperties > 0) userAddress.value = address;
}

async function getProfile() {
  try {
    loadingProfile.value = true;
    const { data: profile } = await auth.get("auth/profile");
    userProfile.value = profile;
    validateAddress();
  } catch (error) {
    console.log(error);
  } finally {
    loadingProfile.value = false;
  }
}

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

async function getOrders() {
  try {
    loadingOrders.value = true;
    const { data: orders } = await auth.get("orders");
    userOrders.value = orders.data;
  } catch (error) {
    console.log(error);
  } finally {
    loadingOrders.value = false;
  }
}

// Lógica del Panel "In-place"
const isEditingAddress = ref(false);
const addressForm = ref(null);
const loadingSaveAddress = ref(false);

const isEditingName = ref(false);
const formName = ref("");
const loadingSaveName = ref(false);

const isEditingPassword = ref(false);
const loadingSavePassword = ref(false);
const showOldPass = ref(false);
const showNewPass = ref(false);
const showConfirmPass = ref(false);
const formPassword = ref({
  old_password: "",
  new_password: "",
  comfirm_password: "",
});

const formAddress = ref({
  street: "",
  city: "",
  state: "",
  zip: "",
  phone: "",
});

function attemptChangeName() {
  if (userAddress.value === null) {
    $q.notify({
      message:
        t('profile_name_change_warning'),
      color: "warning",
      icon: "warning",
    });
    return;
  }

  // Desbloquear Edición
  formName.value = userProfile.value.name;
  isEditingName.value = true;
}

function closeNameModal() {
  isEditingName.value = false;
}

async function saveName() {
  loadingSaveName.value = true;
  try {
    const adr = userProfile.value.address || {};
    const payload = {
      name: formName.value,
      email: userProfile.value.email,
      street: adr.street || adr.streat || "",
      city: adr.city || "",
      state: adr.state || "",
      zip: adr.zip || "",
      phone: adr.phone || "",
    };
    await apiAuth().patch(`users/${userProfile.value.id}`, payload);

    $q.notify({
      message: t('profile_name_saved'),
      color: "positive",
    });

    userProfile.value.name = formName.value;
    isEditingName.value = false;
  } catch (error) {
    console.log(error);
    $q.notify({
      message: getBackendError(error, "¡Oops! Ocurrió un error al guardar"),
      color: "negative",
    });
  } finally {
    loadingSaveName.value = false;
  }
}

function openAddressModal() {
  const adr = userProfile.value.address || {};
  formAddress.value = {
    street: adr.street || adr.streat || "",
    city: adr.city || "",
    state: adr.state || "",
    zip: adr.zip || "",
    phone: adr.phone || "",
  };
  isEditingAddress.value = true;
}

function closeAddressModal() {
  isEditingAddress.value = false;
}

async function saveAddress() {
  try {
    loadingSaveAddress.value = true;
    const payload = {
      name: userProfile.value.name,
      email: userProfile.value.email,
      street: formAddress.value.street,
      city: formAddress.value.city,
      state: formAddress.value.state,
      zip: formAddress.value.zip,
      phone: formAddress.value.phone,
    };

    // Actualizando el usuario haciendo PATCH a su ID
    await auth.patch(`users/${userProfile.value.id}`, payload);

    $q.notify({
      message: t('profile_address_saved'),
      color: "positive",
    });

    // Inyección optimista para repintar UI al instante
    userProfile.value.address = {
      street: formAddress.value.street,
      city: formAddress.value.city,
      state: formAddress.value.state,
      zip: formAddress.value.zip,
      phone: formAddress.value.phone,
    };
    userAddress.value = userProfile.value.address;

    isEditingAddress.value = false;
  } catch (error) {
    console.log(error);
    $q.notify({
      message: getBackendError(error, t('profile_save_error')),
      color: "negative",
    });
  } finally {
    loadingSaveAddress.value = false;
  }
}

function openPasswordModal() {
  formPassword.value = {
    old_password: "",
    new_password: "",
    comfirm_password: "",
  };
  isEditingPassword.value = true;
}

function closePasswordModal() {
  isEditingPassword.value = false;
}

async function savePassword() {
  try {
    loadingSavePassword.value = true;
    const url = "users/update/password";
    
    await auth.patch(url, formPassword.value);

    $q.notify({
      message: t('profile_password_saved'),
      color: "positive",
      icon: "check"
    });

    isEditingPassword.value = false;
  } catch (error) {
    console.log(error);
    $q.notify({
      message: getBackendError(error, t('profile_password_error') || t('profile_save_error')),
      color: "negative",
      icon: "error"
    });
  } finally {
    loadingSavePassword.value = false;
  }
}
</script>

<style scoped>
.container {
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 50px;
}

.line-height-relaxed {
  line-height: 1.6;
}

.profile__title {
  font-family: "Switzer-Variable", serif;
  color: #707279;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: calc(18px * 0.003);
}

.profile__content {
  font-family: "Switzer-Variable", serif;
  color: #707279;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: calc(18px * 0.005);
}

.profile-card-content {
  font-family: "Switzer-Variable", Switzer, serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0.05em;
  color: var(--Black-button, #2f3033);
}

.btn-cancel-form {
  font-family: "Switzer-Variable", Switzer, serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0.05em;
  text-align: center;
  color: #2f3033;
}

.profile-card-link {
  font-family: "Switzer-Variable", Switzer, serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: 0.05em;
  text-decoration: underline;
  text-decoration-style: solid;
  color: var(--Body-Text, #707279);
}

:deep(.profile-menu-tab) {
  font-family: "Switzer-Variable", Switzer, serif;
  font-weight: 400 !important;
  font-style: normal;
  font-size: 14px;
  line-height: 130%;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--Body-Text, #707279);
  justify-content: flex-start;
  text-align: left !important;
  border-bottom: 1px solid #e8e9ef;
  width: 100%;
  padding: 0 0 0 20px !important;
  min-height: 38px !important;
  height: 38px !important;
}

:deep(.profile-menu-tab--active) {
  background-color: #2f3033;
  color: #e8e9ef !important;
  border-bottom: 1px solid #2f3033;
}

:deep(.custom-input-border .q-field__control) {
  border-radius: 4px;
  background-color: #fafafa;
}
:deep(.custom-input-border .q-field__control:before) {
  border-color: #e8e9ef;
}

.elegant-fade-enter-active,
.elegant-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.elegant-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.elegant-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
.purchases__container {
  max-width: 850px;
}

.purchases__header {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 14px;
  color: #707279;
  border-bottom: 1px solid #e3e4eb;
}

.purchases__row {
  border-bottom: 1px solid #e3e4eb;
}

.purchases__folio {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 14px;
  color: #4f4f4f;
}

.purchases__product-name {
  font-family: "Switzer-Variable", serif;
  font-weight: 400;
  font-size: 13px;
  color: #707279;
}

.purchases__date {
  font-family: "Switzer-Variable", serif;
  font-weight: 500;
  font-size: 14px;
  color: #707279;
}

.purchases__cost {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 16px;
  color: #2F3033;
}

.purchases__action {
  font-family: "Switzer-Variable", serif;
  font-weight: 600;
  font-size: 14px;
  color: #2f3033;
  text-decoration: underline;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .container {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 30px;
  }
  .purchases__header {
    display: none;
  }
  .purchases__row {
    flex-direction: column;
    align-items: flex-start;
  }
  .purchases__action--mobile-full {
    display: block;
    width: 100%;
    margin-top: 10px;
    background-color: #2f3033;
    color: white !important;
    text-align: center;
    padding: 12px 0;
    border-radius: 30px;
    text-decoration: none;
    font-size: 16px;
  }
  .form-buttons-container {
    flex-direction: column;
    justify-content: center;
  }
  .form-btn-save {
    width: 100% !important;
  }
  .form-btn-cancel {
    margin-left: 0 !important;
    margin-top: 20px;
  }
}
</style>
