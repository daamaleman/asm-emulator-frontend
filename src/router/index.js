import { createRouter, createWebHistory } from 'vue-router'
import EmuladorView from '@/views/EmuladorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/emulador' },
    { path: '/emulador', name: 'emulador', component: EmuladorView },
    {
      path: '/traductor',
      name: 'traductor',
      component: () => import('@/views/TraductorView.vue'),
    },
  ],
})

export default router