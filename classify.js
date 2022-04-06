module.exports = [
  {
    name: '1工程',
    router: [
      {
        path: '/about',
        name: 'about',
        // 路由必须都是绝对路径
        component: '@/unuse/App.vue'
      }
    ]
  },
  {
    name: '2工程',
    router: [
      {
        path: '/about',
        name: 'about',
        // 路由必须都是绝对路径
        component: '@/unuse/main.js'
      }
    ]
  }
]
