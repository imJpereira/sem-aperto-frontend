import { createRouter, createWebHistory } from 'vue-router'
import ExpensesView from '../views/ExpensesView.vue'
import PlansView from '@/views/PlansView.vue'
import PlanDetailsView from '@/views/PlanDetailsView.vue'
import SignInView from '@/views/SignInView.vue'
import SignUpView from '@/views/SignUpView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/signin',
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
    {
      path: '/signin',
      name: 'SignIn',
      component: SignInView,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUpView,
    }
  ],
})

export default router
