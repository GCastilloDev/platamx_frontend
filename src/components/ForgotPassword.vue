<template>
  <q-dialog
    v-model="dialogVisible"
    persistent
    :backdrop-filter="backdropFilter"
  >
    <q-card style="width: 420px">
      <q-card-section class="text-right q-pb-none">
        <q-icon
          @click="closeDialog"
          class="icon__close"
          name="close"
          color="black"
          size="28px"
        ></q-icon>
      </q-card-section>
      
      <q-card-section class="q-pt-none">
        <div class="login__title">{{ t('forgot_title') }}</div>
        <p class="forgot-subtitle q-mt-sm">
          {{ t('forgot_subtitle') }}
        </p>
      </q-card-section>

      <q-form ref="forgotForm" @submit="submitRecovery">
        <q-card-section>
          <p class="input__title">{{ t('forgot_email_label') }}</p>
          <q-input
            autofocus
            standout
            v-model="email"
            type="email"
            placeholder="ejemplo@hotmail.com"
            stack-label
            :rules="rules.email"
            class="q-mb-md"
          >
          </q-input>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-lg">
          <button
            class="login__button"
            type="submit"
            style="outline: none; border: none; font-family: 'Switzer-Variable', Switzer, serif; width: auto; padding: 0 48px;"
            :disabled="loading"
          >
            <span v-if="!loading">{{ t('forgot_cta') }}</span>
            <q-spinner-tail v-if="loading" color="white" size="2em" />
          </button>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from 'vue-i18n';
import { apiNoAuth } from "../boot/axios";
import validationRules from "../rules";
import { getBackendError } from "../utils/error";

const { t } = useI18n();
const $q = useQuasar();
const rules = validationRules();

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(["close"]);

const dialogVisible = ref(false);
const email = ref("");
const loading = ref(false);
const forgotForm = ref(null);
const backdropFilter = ref("blur(5px) saturate(150%)");

watch(
  () => props.open,
  (val) => {
    dialogVisible.value = val;
    if (val) email.value = "";
  }
);

function closeDialog() {
  emit("close");
}

async function submitRecovery() {
  const success = await (forgotForm.value as any).validate();
  if (!success) return;

  try {
    loading.value = true;
    const url = "auth/recovery/password";
    const payload = { email: email.value };

    await apiNoAuth.post(url, payload);

    $q.notify({
      message: t('forgot_success'),
      color: "positive",
      icon: "check"
    });
    
    closeDialog();
  } catch (error) {
    console.error(error);
    $q.notify({
      message: getBackendError(error, t('forgot_error')),
      color: "negative",
      icon: "error"
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.forgot-subtitle {
  font-family: "Switzer-Variable", serif;
  font-size: 14px;
  color: #707279;
  line-height: 1.4;
}

/* Reusing styles from Login.vue/CreateAccount.vue but scoped if needed */
.login__title {
  font-family: "Playfair Display", serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 26px;
  color: #2d2e36;
}

.login__button {
  cursor: pointer;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 50px;
  border-radius: 360px;
  color: #ffffff;
  background-color: #2f3033;
}

.input__title {
  font-weight: 500;
  font-size: 18px;
  line-height: 24px;
  color: #2d2e36;
  padding: 0;
  margin-bottom: 8px;
}

.icon__close {
  cursor: pointer;
}
</style>
