import { createRouter, createWebHashHistory } from "vue-router";
import { role } from "./../utils";

import master from './master';
import collection from './collectionList';
import recruitment from './recruitment';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...master,//Master general
     ...collection,//List Collection
     ...recruitment,//Recruitment module
    {
      path: "/",
      component: () => import("./../layouts/MainLayout.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/login",
      component: () => import("./../pages/LoginPage.vue"),
      meta: { title: "Login — Recruitment DBC" }
    },
    {
      path: "/404",
      component: () => import("./../pages/Error404.vue"),
    },
    {
      path: "/login-pass",
      component: () => import("./../layouts/MainLayout.vue"),
    },
    // Always leave this as last one,
    // but you can also remove it
    {
      path: "/:catchAll(.*)*",
      component: () => import("./../pages/Error404.vue"),
    },
  ],
});


router.beforeEach(async (to, from, next) => {
  window.scrollTo(0, 0);

  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description);
    }
  }

  // Auth guard: redirect to login if no token
  const token = window.localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  // If logged in and trying to access login page, redirect to home
  if (to.path === '/login' && token) {
    return next('/');
  }

  next();
});

export default router;
