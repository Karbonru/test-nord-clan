import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Page404 from './views/Page404.vue'
import Account from './views/Account.vue'
import Payment from './views/Payment.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: "*", name: '404', component: Page404 },
    { path: '/', name: 'Index', component: Index},
    { path: '/account', name: 'Account', component: Account,
      meta: { requiresAuth: true }
    },
    { path: '/payment/:id', name: 'Payment', component: Payment, props: true,
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    const localUser = localStorage.getItem('user')
    if(localUser) {
      next()
    } else {
      next({
        path: '/',
        params: { nextUrl: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router
