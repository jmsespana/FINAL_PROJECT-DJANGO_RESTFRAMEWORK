// router/index.ts

import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import { routes as autoRoutes } from "vue-router/auto-routes";
import { useAuthStore } from "@/stores/auth";
import Hero from "@/pages/index.vue";
import Dashboard from "@/pages/Dashboard.vue";
import NotFound from "@/pages/NotFoundPage.vue";
import ChatBase from "@/pages/ChatBase.vue";

const routes = setupLayouts([
  ...autoRoutes,
  { path: "/", component: Hero },
  { path: "/:pathMatch(.*)*", component: NotFound },
  { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/chat", component: ChatBase, meta: { requiresAuth: true } },
]);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Prevent browser back/forward navigation (when logged out or on restricted routes)
function preventBackNavigation() {
  if (window.location.pathname === "/" || window.location.pathname === "/login") {
    history.pushState(null, document.title, location.href);
    window.onpopstate = () => {
      history.pushState(null, document.title, location.href);
    };
  }
}

// Global authentication and role-based guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Load token from localStorage if available
  if (!authStore.accessToken) {
    authStore.loadTokenFromStorage();
  }

  const isAuthenticated = !!authStore.accessToken;
  const userRole = localStorage.getItem("Role")
    ? JSON.parse(localStorage.getItem("Role"))
    : null;
  const hasVisitedDashboard = JSON.parse(
    localStorage.getItem("hasVisitedDashboard") || "false"
  );

  console.log("isAuthenticated:", isAuthenticated);
  console.log("User Role:", userRole);

  // Public pages
  const publicPages = ["/"];

  // Protected pages
  const protectedPages = ["/dashboard", "/chat"];

  if (protectedPages.includes(to.path.toLowerCase()) && !isAuthenticated) {
    return next("/");
  }

  if (isAuthenticated && userRole && !hasVisitedDashboard) {
    localStorage.setItem("hasVisitedDashboard", "true");
    return next("/dashboard");
  }

  if (publicPages.includes(to.path.toLowerCase()) && isAuthenticated) {
    return next("/dashboard");
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: "/", query: { redirect: to.fullPath } });
  } else if (isAuthenticated && (to.path === "/" || to.path === "/")) {
    next("/dashboard");
  } else {
    next();
  }
});

// Call preventBackNavigation when necessary
router.isReady().then(() => {
  if (!useAuthStore().accessToken) {
    preventBackNavigation();
  }
});

// Clean up after dynamic import error handling
router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

// Logout function
function logout() {
  const authStore = useAuthStore();

  // Clear the authentication token from localStorage
  localStorage.removeItem("auth_token");
  localStorage.removeItem("Role");
  alert("Logout successful");

  // Reset token and role in the store
  authStore.accessToken = null;

  // Redirect to home page
  router.push("/");
  preventBackNavigation();
}

export { logout };
export default router;
