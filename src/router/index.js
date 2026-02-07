import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginScreen from '../components/LoginScreen.vue';
import PageNotFound from '../components/PageNotFound.vue';
import Tasks from '../views/TasksInfo.vue';
import Builds from '../views/BuildsInfo.vue';
import Versions from '../views/VersionsInfo.vue';
import Products from '../views/ProductsInfo.vue';
import Employee from '../views/EmployeeInfo.vue';
import MsamTool from '../views/MsamTool.vue';
import FuotaInfo from '../views/FuotaInfo.vue';
import LoopbackInfo from '../views/LoopbackInfo.vue';
import BuildFlow from '../views/BuildFlow.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ProductsInfo',
    component: Products
  },
  {
    path: '/login',
    name: 'LoginScreen',
    component: LoginScreen
  },
  {
    path: '/tasks',
    name: 'TasksInfo',
    component: Tasks
  },
  {
    path: '/builds',
    name: 'BuildsInfo',
    component: Builds
  },
  {
    path: '/versions',
    name: 'VersionsInfo',
    component: Versions
  },
  {
    path: '/employee',
    name: 'EmployeeInfo',
    component: Employee
  },
  {
    path: '/msamtool',
    name: 'MsamTool',
    component: MsamTool
  },
  {
    path: '/fuota',
    name: 'FuotaInfo',
    component: FuotaInfo
  },
  {
    path: '/loopback',
    name: 'LoopbackInfo',
    component: LoopbackInfo
  },
  {
    path: '/buildflow',
    name: 'BuildFlow',
    component: BuildFlow
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  },
]

export const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;

router.beforeResolve((to, from, next) => {
  const sessionKey = sessionStorage.getItem("access_token");
  const token = sessionKey
    ? localStorage.getItem(`access_token${sessionKey}`)
    : null;

  const isAuthenticated = Boolean(token);
  const isLoginPage = to.path === "/login";
  const isUnknownRoute = to.matched.length === 0;

  // Unknown route → DO NOTHING (no redirect)
  if (isUnknownRoute) {
    return next();
  }

  // Not logged in → redirect to login
  if (!isAuthenticated && !isLoginPage) {
    return next("/login");
  }

  // Logged in user should not see login page
  if (isAuthenticated && isLoginPage) {
    return next("/");
  }

  // Allow everything else
  next();
});

