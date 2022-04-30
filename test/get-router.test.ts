import { getRouter, getRouterFilePath, getAllRouter } from '../src/commands/get-router'
const rootPath = process.cwd().replace(/\\/g, '/')
describe('getRouter的测试', () => {
  test('getRouter--获取路由', () => {
    const p = rootPath + '/router/index.js'
    const arrs = getRouter(p)
    const routerArrs = [
      {
        path: "'/dashboard/analysis'",
        component: "'@/unuse/components/test2/HelloWorld.vue'"
      },
      { path: "'/app'", component: "'@/unuse/App'" },
      {
        path: "'/form/base-form'",
        component: "'@/unuse/components/user-rulerts.vue'"
      }
    ]
    expect(arrs).toMatchObject(routerArrs)
  })

  test('getRouterFilePath--递归获取路由数组', () => {
    const arrs = getRouterFilePath()
    const routerArrs = [process.cwd() + '\\router\\container\\index.js', process.cwd() + '\\router\\index.js']
    expect(arrs).toMatchObject(routerArrs)
  })

  test('getAllRouter--获取所有路由', () => {
    const arrs = getAllRouter()
    const routerArrs = [
      {
        component: "'@/unuse/components/test/deep/user.vue'",
        path: "'test/deep/user'"
      },
      {
        component: "'@/unuse/components/test2/HelloWorld.vue'",
        path: "'/dashboard/analysis'"
      },
      {
        component: "'@/unuse/App'",
        path: "'/app'"
      },
      {
        component: "'@/unuse/components/user-rulerts.vue'",
        path: "'/form/base-form'"
      }
    ]
    expect(arrs).toMatchObject(routerArrs)
  })
})
