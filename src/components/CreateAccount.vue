<template>
  <q-dialog
    v-model="dialogCreateAccount"
    persistent
    :backdrop-filter="backdropFilter"
  >
    <q-card style="width: 420px">
      <q-card-section class="text-right q-pb-none">
        <q-icon
          @click="closeCreateAccount"
          class="icon__close"
          name="close"
          color="black"
          size="28px"
        ></q-icon>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="login__title">Regístrate</div>
      </q-card-section>
      <q-form ref="accountCreateForm">
        <q-card-section>
          <p class="input__title">Nombre completo</p>
          <q-input
            :autofocus="true"
            standout
            v-model="user.name"
            type="text"
            placeholder="Arturo Salinas Nuñez"
            stack-label
            :rules="rules.required"
          >
          </q-input>
        </q-card-section>
        <q-card-section>
          <p class="input__title">Correo electrónico</p>
          <q-input
            :autofocus="true"
            standout
            v-model="user.email"
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
            v-model="user.password"
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
        <q-card-section>
          <p class="input__title">Confirmar contraseña</p>
          <q-input
            :type="typeInputPasswordConfirm"
            placeholder="•••••••"
            standout
            v-model="user.password_comfirm"
            :rules="rules.confirmPassword(user.password)"
          >
            <template v-slot:append>
              <q-icon
                style="cursor: pointer"
                @click="changeIconConfirm"
                :name="iconPasswordConfirm"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-form>

      <q-card-actions align="center">
        <span
          class="login__button"
          @click="createAccountValidate"
          ref="createAccountButton"
        >
          <span v-if="!loading">Registrarme</span>
          <q-spinner-tail v-if="loading" color="white" size="2em" />
        </span>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuasar } from "quasar";

import axios from "axios";

import validationRules from "../rules";

const rules = validationRules();
const $q = useQuasar();
const dialogCreateAccount = ref(false);
const backdropFilter = ref("blur(5px) saturate(150%)");
const iconPassword = ref("visibility");
const iconPasswordConfirm = ref("visibility");
const typeInputPassword = ref("password");
const typeInputPasswordConfirm = ref("password");
const loading = ref(false);
const accountCreateForm = ref(null);
const createAccountButton = ref(null);

const user = ref({
  name: "",
  email: "",
  password: "",
  password_comfirm: "",
});

const emit = defineEmits(["close", "openLogin"]);

const props = defineProps<{
  open: boolean;
}>();

watch(
  () => props.open,
  (data: boolean) => {
    dialogCreateAccount.value = data;
  }
);

function closeCreateAccount() {
  for (const property in user.value) {
    user.value[property] = "";
  }

  iconPassword.value = "visibility";
  iconPasswordConfirm.value = "visibility";
  typeInputPassword.value = "password";
  typeInputPasswordConfirm.value = "password";
  // dialogCreateAccount.value = false;
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

function changeIconConfirm() {
  if (iconPasswordConfirm.value === "visibility") {
    iconPasswordConfirm.value = "visibility_off";
    typeInputPasswordConfirm.value = "text";
    return;
  }
  if (iconPasswordConfirm.value === "visibility_off") {
    iconPasswordConfirm.value = "visibility";
    typeInputPasswordConfirm.value = "password";
    return;
  }
}

function createAccountValidate() {
  accountCreateForm.value.validate().then((success) => {
    if (success) {
      createAccount();
    }
  });
}

async function createAccount() {
  try {
    createAccountButton.value?.setAttribute("disabled", "");
    loading.value = true;
    const url = "https://platamx-backend-98b7dd1a72e1.herokuapp.com/users";

    await axios.post(url, user.value);
    $q.notify("Cuenta creada correctamente");
    emit("openLogin");
    // dialogCreateAccount.value = false;
    // dialogLogin.value = true;
  } catch (error) {
    console.log(error);
    $q.notify({
      message: "Error al crear la cuenta",
      color: "red",
    });
  } finally {
    for (const property in user.value) {
      user.value[property] = "";
    }
    createAccountButton.value?.removeAttribute("disabled");
    loading.value = false;
  }
}
</script>

<style lang="css" scoped></style>
