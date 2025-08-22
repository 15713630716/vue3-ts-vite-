import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { axiosToken } from '../request/getToken'
import { useStoreToken, useStoreRouter } from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    //登录
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    //首页已部署至北岙项目部
    path: '/index',
    name: 'index',
    component: () => import('@/views/home/index.vue'),
  },
  {
    //首页未部署
    path: '/index-dev',
    name: 'index-dev',
    component: () => import('@/view/home/index.vue'),
  },
  // {
  //   //前期
  //   path: '/prophase',
  //   component: () => import('@/views/prophase/index.vue'),
  // },
  // {
  //   //建设
  //   path: '/construct',
  //   component: () => import('@/views/construct/index.vue'),
  // },
  // {
  //   //未来
  //   path: '/future',
  //   component: () => import('@/views/future/index.vue'),
  // },
  // {
  //   //ue
  //   path: '/ues',
  //   component: () => import('@/views/ue/ue.vue'),
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }), // 禁用滚动行为
})

router.beforeEach(async (to: any, from, next) => {
  //如果路由跳转是相同的，就取消
  if (to.name === from.name && to.name != undefined) return;

  const storeRouter = useStoreRouter();
  if (to.name == 'index-dev') {
    storeRouter.setRouterUrlStore('#/index-dev')
  }
  if (to.name == 'index') {
    storeRouter.setRouterUrlStore('#/index')
  }
  const tokenStore = useStoreToken();
  let token = tokenStore.token;

  //请求token
  if (token == '') {
    // 获取token
    await axiosToken();
    next();
  } else {
    next();
  }
});

export default router