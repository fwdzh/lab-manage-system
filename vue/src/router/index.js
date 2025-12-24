import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/VueLogin.vue'
import Register from '@/components/VueRegister.vue'
import Home from '@/views/HomePage.vue'
import VueUser from '@/components/VueUser.vue'
import VueLab from '@/components/VueLab.vue'
import VueDevice from '@/components/VueDevice.vue'
import LabReserve from '@/components/LabReserve.vue'
import DeviceBorrow from '@/components/DeviceBorrow.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/',
      component: Home,
      children: [
        { path: 'user', component: VueUser, name: 'user' },
        { path: 'lab', component: VueLab, name: 'lab' },
        { path: 'device', component: VueDevice, name: 'device' },
        { path: 'reservation', component: LabReserve, name: 'reservation' },
        { path: 'borrow_device', component: DeviceBorrow },
      ],
    },
    // { path: '/user', component: VueUser, name: 'user' },
    { path: '/', redirect: '/home' },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (token || to.path === '/login' || to.path === '/register') {
    console.log(token, typeof token)
    next()
  } else {
    next('/login')
  }
})
export default router
