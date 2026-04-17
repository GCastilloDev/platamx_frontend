<template>
  <q-page class="reset-wrapper q-pa-md">
    <div class="row justify-center items-center full-height full-width q-pt-xl">
      <div class="reset-container">
        <h1 class="reset-title">{{ locale === 'en-US' ? 'Reset your password' : 'Restablecer contraseña' }}</h1>
        <p class="reset-subtitle q-mb-lg">
          {{ locale === 'en-US' ? 'Enter a new password for your account. Please make sure it meets our security requirements.' : 'Ingresa una nueva contraseña para tu cuenta. Por favor asegúrate de que cumpla con los requisitos de seguridad.' }}
        </p>

        <q-form @submit="resetPassword" class="q-gutter-md">
          <q-input
            v-model="password"
            :rules="rules.password"
            :type="showPassword ? 'text' : 'password'"
            :label="locale === 'en-US' ? 'New Password' : 'Nueva contraseña'"
            outlined
            color="black"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            :rules="rules.confirmPassword(password)"
            :type="showConfirm ? 'text' : 'password'"
            :label="locale === 'en-US' ? 'Confirm Password' : 'Confirmar contraseña'"
            outlined
            color="black"
            lazy-rules
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirm ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirm = !showConfirm"
              />
            </template>
          </q-input>

          <div class="q-pt-md">
            <q-btn
              type="submit"
              class="reset-btn full-width"
              :label="locale === 'en-US' ? 'Save Password' : 'Guardar Contraseña'"
              :loading="loading"
              unelevated
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useI18n } from 'vue-i18n';
import { apiNoAuth } from "../boot/axios";
import validationRules from "../rules";
import { getBackendError } from "../utils/error";

const { locale, t } = useI18n();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// Validaciones
const rules = validationRules();

// Estados
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirm = ref(false);
const loading = ref(false);

async function resetPassword() {
  const token = route.query.token;
  if (!token) {
    $q.notify({
      color: 'negative',
      message: locale.value === 'en-US' ? 'Invalid or missing token.' : 'Token inválido o faltante.',
      icon: 'error'
    });
    return;
  }

  try {
    loading.value = true;
    const url = "auth/reset-password";
    const data = {
      token: token,
      newPassword: password.value,
    };
    
    await apiNoAuth.post(url, data);

    $q.notify({
      color: 'positive',
      message: locale.value === 'en-US' ? 'Password updated successfully. You can now login.' : 'Contraseña actualizada con éxito. Ya puedes iniciar sesión.',
      icon: 'check'
    });
    
    const lang = locale.value === 'en-US' ? 'en' : 'es';
    router.push(`/${lang}/`);
  } catch (error) {
    $q.notify({
      color: "negative",
      message: getBackendError(error, locale.value === 'en-US' ? 'Error resetting password' : 'Error al restablecer la contraseña'),
      icon: "error"
    });
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.reset-wrapper {
  background-color: #fafafa;
}

.reset-container {
  width: 100%;
  max-width: 450px;
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.reset-title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 32px;
  color: #2d2e36;
  margin-top: 0;
  margin-bottom: 12px;
  text-align: center;
  line-height: 1.2;
}

.reset-subtitle {
  font-family: "Switzer-Variable", serif;
  font-size: 15px;
  color: #707279;
  text-align: center;
  line-height: 1.4;
}

.reset-btn {
  font-family: "Switzer-Variable", serif;
  font-size: 16px !important;
  height: 50px;
  background-color: #2f3033;
  border-radius: 360px;
  color: #ffffff;
  font-weight: 500;
  text-transform: none;
}
</style>
