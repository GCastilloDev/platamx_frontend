<template>
  <q-dialog v-model="dialogLogin" persistent :backdrop-filter="backdropFilter">
    <q-card style="width: 100%; max-width: 420px;">
      <q-card-section class="text-right q-pb-none">
        <q-icon
          @click="closeLogin"
          class="icon__close"
          name="close"
          color="black"
          size="28px"
        ></q-icon>
      </q-card-section>
      <q-card-section>
        <q-banner v-if="isAddProductShow" class="text-white bg-red">
          {{ t('login_add_product_warning') }}
        </q-banner>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="login__title">{{ t('login_title') }}</div>
      </q-card-section>
      <q-form ref="loginForm" @submit="loginValidate">
        <q-card-section>
          <p class="input__title">{{ t('login_email') }}</p>
          <q-input
            :autofocus="true"
            standout
            v-model="email"
            type="email"
            placeholder="ejemplo@hotmail.com"
            stack-label
            :rules="rules.email"
          >
          </q-input>
        </q-card-section>
        <q-card-section>
          <p class="input__title">{{ t('login_password') }}</p>
          <q-input
            :type="typeInputPassword"
            placeholder="•••••••"
            standout
            v-model="password"
            :rules="rules.password"
          >
            <template v-slot:append>
              <q-icon
                style="cursor: pointer"
                @click="changeIcon"
                :name="iconPassword"
              />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p class="forgot-password" @click="emit('forgotPassword')">
            {{ t('forgot_password_link') }}
          </p>
        </q-card-section>

        <q-card-actions align="center" style="margin-top: 10px">
          <button class="login__button" type="submit" style="outline: none; border: none; font-family: 'Switzer-Variable', Switzer, serif; width: auto; padding: 0 32px;" :disabled="loading" ref="loginButton">
            <span v-if="!loading">{{ t('login_cta') }}</span>
            <q-spinner-tail v-if="loading" color="white" size="2em" />
          </button>
        </q-card-actions>
      </q-form>
      <q-card-section>
        <p class="login__create-account">
          {{ t('login_no_account') }}
          <span @click="openCreateAccount">{{ t('login_register_link') }}</span>
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";
import { useI18n } from 'vue-i18n';

import validationRules from "../rules";
import { API_BASE_URL } from "../constants/api";
import { getBackendError } from "../utils/error";
import { useAuthStore } from "../stores/auth";

const { t } = useI18n();
const $q = useQuasar();
const authStore = useAuthStore();
const rules = validationRules(t);
const email = ref("");
const password = ref("");
const iconPassword = ref("visibility");
const typeInputPassword = ref("password");
const dialogLogin = ref(false);
const backdropFilter = ref("blur(5px) saturate(150%)");
const loginForm = ref(null);
const loading = ref(false);
const loginButton = ref(null);
const isAddProductShow = ref(false);

const emit = defineEmits(["close", "createAccount", "forgotPassword"]);
const props = defineProps<{
  open: boolean;
  isAddProduct?: boolean;
}>();

watch(
  () => props.open,
  (data) => {
    dialogLogin.value = data;
  }
);

watch(
  () => props.isAddProduct,
  (data) => {
    isAddProductShow.value = data;
  }
);

function closeLogin() {
  password.value = "";
  email.value = "";
  iconPassword.value = "visibility";
  typeInputPassword.value = "password";
  // dialogLogin.value = false;
  emit("close");
}

function changeIcon() {
  if (iconPassword.value === "visibility") {
    iconPassword.value = "visibility_off";
    typeInputPassword.value = "text";
    return;
  }
  if (iconPassword.value === "visibility_off") {
    iconPassword.value = "visibility";
    typeInputPassword.value = "password";
    return;
  }
}

function loginValidate() {
  loginForm.value.validate().then((success: any) => {
    if (success) {
      login();
    }
  });
}

function openCreateAccount() {
  emit("createAccount");
  // dialogLogin.value = false;
  // dialogCreateAccount.value = true;
}

async function login() {
  try {
    loginButton.value?.setAttribute("disabled", "");
    loading.value = true;
    const url = `${API_BASE_URL}/auth/login`;

    const data = {
      email: email.value,
      password: password.value,
    };
    const { data: response } = await axios.post(url, data);
    const token = response.data.access_token;
    authStore.saveToken(token);

    email.value = "";
    password.value = "";

    // dialogLogin.value = false;
    emit("close");
    $q.notify(t('login_success'));
  } catch (error) {
    $q.notify({
      message: getBackendError(error, t('login_error')),
      color: "red",
    });
    console.log(error);
  } finally {
    loginButton.value?.removeAttribute("disabled");
    loading.value = false;
  }
}

</script>
<style scoped>
.forgot-password {
  cursor: pointer;
  font-size: 14px;
  color: #2f3033;
  text-decoration: underline;
  text-align: right;
  margin: 0;
  font-family: 'Switzer-Variable', Switzer, serif;
}
</style>
