import Vue from 'vue'
import Router from 'vue-router'
export  const routers = [
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/workplace',
    meta: { title: '仪表盘', icon: 'dashboard', permission: ['dashboard'] },
    children: [
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        component: () => import('@/unuse/components/test2/HelloWorld.vue'),
        meta: { title: '分析页', permission: ['dashboard'] }
      },
      {
        path: '/app',
        name: 'Monitor',
        hidden: true,
        component: () => import('@/unuse/App'),
        meta: { title: '监控页', permission: ['dashboard'] }
      }
    ]
  },
  {
    path: '/form',
    redirect: '/form/basic-form',
    component: PageView,
    meta: { title: '表单页', icon: 'form', permission: ['form'] },
    children: [
      {
        path: '/form/base-form',
        name: 'BaseForm',
        component: () => import('@/unuse/components/user-rulerts.vue'),
        meta: { title: '基础表单', permission: ['form'] }
      }
    ]
  }
]
Vue.use(Router)
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: routers
})
