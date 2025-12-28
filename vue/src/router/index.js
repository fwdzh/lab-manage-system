import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/VueLogin.vue'
import Register from '@/components/VueRegister.vue'
import Home from '@/views/HomePage.vue'
import VueUser from '@/components/VueUser.vue'
import VueLab from '@/components/VueLab.vue'
import VueDevice from '@/components/VueDevice.vue'
import LabReserve from '@/components/LabReserve.vue'
import DeviceBorrow from '@/components/DeviceBorrow.vue'
import UserHome from '@/views/UserHome.vue'
import UserReserve from '@/components/UserReserve.vue'
import UserDefault from '@/components/UserDefault.vue'
import UserLab from '@/components/UserLab.vue'
import AdminDefault from '@/components/AdminDefault.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/admin',
      component: Home,
      children: [
        {path: '/admin', component: AdminDefault},
        { path: '/admin/user', component: VueUser, name: 'user' },
        { path: '/admin/lab', component: VueLab, name: 'lab' },
        { path: '/admin/device', component: VueDevice, name: 'device' },
        { path: '/admin/reservation', component: LabReserve, name: 'reservation' },
        { path: '/admin/borrow_device', component: DeviceBorrow },
      ],
    },
    {
      path: '/',
      component: UserHome,
      children: [
        {path: '', component: UserDefault},
        {path: 'reserve_records', component: UserReserve},
        {path: 'lab', component: UserLab}
      ]
    }
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
