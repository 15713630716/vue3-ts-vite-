import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { axiosToken } from '../request/getToken'
import { useStoreToken } from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    //首页
    path: '/index',
    component: () => import('@/views/home/index.vue'),
  },
  {
    //ue测试
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    //前期
    path: '/prophase',
    component: () => import('@/views/prophase/index.vue'),
  },
  {
    //建设
    path: '/construct',
    component: () => import('@/views/construct/index.vue'),
  },
  {
    //未来
    path: '/future',
    component: () => import('@/views/future/index.vue'),
  },
  {
    //ue
    path: '/ues',
    component: () => import('@/views/ue/ue.vue'),
  },
]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
})

router.beforeEach(async (to: any, from, next) => {
  //如果路由跳转是相同的，就取消
  if (to.name === from.name && to.name != undefined) return;

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