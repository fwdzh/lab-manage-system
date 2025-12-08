import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Home from '@/components/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/register', component: Register},
    { path: '/home', component: Home },
    { path: '/', redirect: '/login' }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if(token || to.path === '/login' || to.path === '/register'){
    console.log(token, typeof token)
    next()
  }else{
    next('/login')
  }
})
export default router
