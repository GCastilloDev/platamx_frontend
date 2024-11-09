<template>
  <section class="container">
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="black"
          @update:model-value="tabEvent"
        >
          <q-tab name="account" label="MI CUENTA" />
          <q-tab name="purchases" label="MI LISTA DE COMPRAS" />
          <q-tab name="exit" label="SALIR DE LA CUENTA" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="account">
            <section class="row">
              <div class="col-3 profile__title">Nombre</div>
              <div class="col-9">
                <q-card flat bordered class="my-card">
                  <q-card-section v-if="loadingProfile">
                    <q-skeleton style="width: 400px" type="text" />
                  </q-card-section>
                  <q-card-section v-if="!loadingProfile">
                    <div class="profile__content">
                      {{ userProfile.name }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </section>

            <section class="row q-mt-md">
              <div class="col-3 profile__title">Correo</div>
              <div class="col-9">
                <q-card flat bordered class="my-card">
                  <q-card-section v-if="loadingProfile">
                    <q-skeleton style="width: 400px" type="text" />
                  </q-card-section>
                  <q-card-section v-if="!loadingProfile">
                    <div class="profile__content">{{ userProfile.email }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </section>

            <section class="row q-mt-md">
              <div class="col-3 profile__title">Dirección</div>
              <div class="col-9">
                <q-card flat bordered class="my-card">
                  <q-card-section v-if="loadingProfile">
                    <q-skeleton style="width: 400px" type="text" />
                    <q-skeleton style="width: 400px" type="text" />
                    <q-skeleton style="width: 400px" type="text" />
                  </q-card-section>
                  <q-card-section v-if="userAddress !== null">
                    <div class="text-bold">
                      {{ userProfile.address.streat }},
                      {{ userProfile.address.city }}, C.P.
                      {{ userProfile.address.zip }}, Teléfono:
                      {{ userProfile.address.phone }}
                    </div>
                  </q-card-section>

                  <q-card-section
                    v-if="userAddress === null && !loadingProfile"
                  >
                    <div class="profile__content">Sin dirección registrada</div>
                  </q-card-section>
                </q-card>
              </div>
            </section>
          </q-tab-panel>

          <q-tab-panel name="purchases">
            <section class="text-center text-h6" v-if="userOrders.length === 0">
              Sin compras
            </section>
            <section class="row" v-if="userOrders.length > 0">
              <div class="col-4">Compras</div>
              <div class="col-8">
                <q-card flat bordered class="my-card">
                  <q-card-section>
                    <div class="text-bold">{{ userOrders }}</div>
                  </q-card-section>
                </q-card>
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
      </template>
    </q-splitter>

    <!-- <div class="row">
      <div class="col-3">

      </div>
      <div class="col-9">

      </div>
    </div> -->
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuasar } from "quasar";
import { apiAuth, apiNoAuth } from "../boot/axios";

import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const auth = apiAuth();
const tab = ref("account");
const splitterModel = ref("30");
const userProfile = ref({});
const userOrders = ref([]);
const userAddress = ref(null);
const loadingProfile = ref(true);

getProfile();

async function tabEvent(event: string) {
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
    router.push({
      name: "home",
    });

    $q.notify("Sesión cerrada correctamente");
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
    loadingProfile.value = false;
  } catch (error) {
    console.log(error);
  }
}

async function getOrders() {
  try {
    const { data: orders } = await auth.get("orders");
    userOrders.value = orders.data;
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.container {
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 50px;
}

.my-card {
  min-height: 166px;
  display: flex;
  align-items: center;
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
  font-weight: 600;
  font-size: 16px;
  letter-spacing: calc(18px * 0.005);
}
</style>
