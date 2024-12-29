import { createRouter, createWebHistory } from 'vue-router'
import DespesasView from '../views/DespesasView.vue'
import PlanosView from '@/views/PlanosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/planos',
    },
    {
      path: '/despesas',
      name: 'despesas',
      component: DespesasView,
    },
    {
      path: '/planos',
      name: 'planos',
      component: PlanosView,
    },
  ],
})

export default router
