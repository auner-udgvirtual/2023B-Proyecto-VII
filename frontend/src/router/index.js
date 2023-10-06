import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppointmentLayout from '@/views/appointments/AppointmentsLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: { name: 'login' }
    },
    {
      path: '/reservaciones',
      name: 'appointments',
      component: AppointmentLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'my-appointments',
          component: () => import('@/views/appointments/MyAppointmentsView.vue'),
        },
        {
          path: 'nueva',
          component: () => import('@/views/appointments/NewAppointmentLayout.vue'),
          children: [
            {
              path: '',
              name: 'new-appointment',
              component: () => import('@/views/appointments/ServicesView.vue'),
            },
            {
              path: 'detalles',
              name: 'appointment-details',
              component: () => import('@/views/appointments/AppointmentView.vue'),
            }
          ]
        },
        {
          path: ':id/editar',
          component: () => import('@/views/appointments/EditAppointmentLayout.vue'),
          children: [
            {
              path: '',
              name: 'edit-appointment',
              component: () => import('@/views/appointments/ServicesView.vue'),
            },
            {
              path: 'detalles',
              name: 'edit-appointment-details',
              component: () => import('@/views/appointments/AppointmentView.vue'),
            }
          ]
        }
      ]
    },
    
  ]
})

export default router
