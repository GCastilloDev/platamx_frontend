<template>
  <q-dialog v-model="dialogLogin" persistent :backdrop-filter="backdropFilter">
    <q-card style="width: 420px">
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
          Para poder agregar un producto a su carrito debe iniciar sesión
          primero.
        </q-banner>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="login__title">Inicio de sesión</div>
      </q-card-section>
      <q-form ref="loginForm">
        <q-card-section>
          <p class="input__title">Correo electrónico</p>
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
          <p class="input__title">Contraseña</p>
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
      </q-form>

      <q-card-actions align="center" style="margin-top: 10px">
        <span class="login__button" @click="loginValidate" ref="loginButton">
          <span v-if="!loading">Iniciar Sesión</span>
          <q-spinner-tail v-if="loading" color="white" size="2em" />
        </span>
      </q-card-actions>
      <q-card-section>
        <p class="login__create-account">
          ¿No tienes cuenta?
          <span @click="openCreateAccount">Regístrate</span>
        </p>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import axios from "axios";

import validationRules from "../rules";

const $q = useQuasar();
const rules = validationRules();
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

const emit = defineEmits(["close", "createAccount"]);
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
    const url = "https://platamx-backend-98b7dd1a72e1.herokuapp.com/auth/login";

    const data = {
      email: email.value,
      password: password.value,
    };
    const { data: response } = await axios.post(url, data);
    const token = response.data.access_token;
    saveToken(token);
    // dialogLogin.value = false;
    emit("close");
    $q.notify("Sesión iniciada correctamente");
  } catch (error) {
    $q.notify({
      message: "Usuario y/o contraseña incorrectos",
      color: "red",
    });
    console.log(error);
  } finally {
    email.value = "";
    password.value = "";
    loginButton.value?.removeAttribute("disabled");
    loading.value = false;
  }
}

function saveToken(token: string) {
  const data = {
    token,
  };
  localStorage.setItem("plataMX", JSON.stringify(data));
}
</script>
<style scoped></style>
