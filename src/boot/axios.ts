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
  baseURL: "https://platamx-backend-98b7dd1a72e1.herokuapp.com/",
});

const apiAuth = () => {
  LocalStorage.getItem("plataMX");
  const token = JSON.parse(LocalStorage.getItem("plataMX"));
  const baseURL = `https://platamx-backend-98b7dd1a72e1.herokuapp.com/`;
  const headers = {
    Authorization: `Bearer ${token?.token}`,
  };

  const http = axios.create({ baseURL, headers });

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
