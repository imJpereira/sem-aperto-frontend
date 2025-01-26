import { createRouter, createWebHistory } from 'vue-router'
import ExpensesView from '../views/ExpensesView.vue'
import PlansView from '@/views/PlansView.vue'
import PlanDetailsView from '@/views/PlanDetailsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/planos',
    },
    {
      path: '/despesas',
      name: 'Expenses',
      component: ExpensesView,
    },
    {
      path: '/planos',
      name: 'Plan',
      component: PlansView,
    },
    {
      path: '/planos/:id',
      name: 'PlanDetail',
      component: PlanDetailsView,
    },
  ],
})

export default router
