import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type NavigationGuardNext,
  type RouteLocationNormalized,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Lazy load components
const LoginPage = () => import("@/components/LoginPage.vue");
const Dashboard = () => import("@/components/Dashboard.vue");
const AuthCallback = () => import("@/components/AuthCallback.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { requiresAuth: false },
  },
  {
    path: "/auth/callback",
    name: "auth-callback",
    component: AuthCallback,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard for auth protection
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore();

    // Wait for auth initialization if user is still loading
    if (authStore.loading && !authStore.user) {
      await new Promise((resolve) => {
        const unwatch = authStore.$subscribe(
          (_mutation: any, state: any) => {
            if (!state.loading) {
              unwatch();
              resolve(null);
            }
          },
          { detached: true }
        );
      });
    }

    const requiresAuth = to.meta.requiresAuth !== false;
    const isAuthenticated = authStore.isAuthenticated;

    if (requiresAuth && !isAuthenticated) {
      // Redirect to login if trying to access protected route
      next({ name: "login", query: { redirect: to.fullPath } });
    } else if (to.name === "login" && isAuthenticated) {
      // Redirect to dashboard if already logged in
      next({ name: "dashboard" });
    } else {
      next();
    }
  }
);

export default router;
