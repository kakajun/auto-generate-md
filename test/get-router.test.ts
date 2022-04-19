import { getRouter } from '../src/commands/get-router'

describe('getRouter的测试', () => {
  test('getRouter--获取路由', () => {
    const arrs = getRouter()
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
})
