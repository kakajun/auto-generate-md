import layout from './components/layout'

const abcd = [
  {
    path: '/abcd',
    component: layout,
    redirect: '/abcd/index',
    children: [
      {
        path: 'test/deep/user',
        name: 'abcd',
        component: () => import('@/unuse/components/test/deep/user.vue'),
        meta: {
          title: '主页',
          icon: 'container',
          affix: true,
          sideType: 1,
          hideBread: true
        }
      }
    ]
  }
]
export default abcd
