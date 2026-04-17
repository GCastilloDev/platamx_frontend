import { boot } from "quasar/wrappers";
import axios, { AxiosInstance } from "axios";
import { LocalStorage } from "quasar";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const apiNoAuth = axios.create({
  baseURL: "https://platamx-backend-1cvg.onrender.com/",
});

const apiAuth = () => {
  const baseURL = `https://platamx-backend-1cvg.onrender.com/`;

  const http = axios.create({ baseURL });

  // Interceptor para inyectar token siempre actualizado antes de cada petición
  http.interceptors.request.use((config) => {
    let rawToken = null;
    if (typeof window !== 'undefined') {
      rawToken = localStorage.getItem('plataMX');
    }
    const token = rawToken ? JSON.parse(rawToken) : null;
    if (token && token.token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }
    return config;
  });

  // Interceptor: si el backend responde 401, sesión expirada → pedir re-login
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Limpiar sesión
        if (typeof window !== 'undefined') {
          localStorage.removeItem('plataMX');
          // Avisar a MainLayout para que abra el diálogo de login
          window.dispatchEvent(new CustomEvent('auth-expired'));
        }
      }
      return Promise.reject(error);
    }
  );

  return http;
};


export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$apiAuth = apiAuth;
  app.config.globalProperties.$apiNoAuth = apiNoAuth;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { apiAuth, apiNoAuth };
