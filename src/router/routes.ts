import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "/",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "product",
        path: "product/:id",
        component: () => import("pages/Product.vue"),
      },
      {
        name: "search",
        path: "search",
        component: () => import("pages/Search.vue"),
      },
      {
        name: "collection",
        path: "collection/:id/:name",
        component: () => import("pages/Collection.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
