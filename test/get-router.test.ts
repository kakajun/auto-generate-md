import { getRouter, getRouterFilePath, getAllRouter } from '../src/commands/get-router'
import { parseRouterPath, parseComponentPath } from '../src/utils/routerUtils'
const rootPath = process.cwd().replace(/\\/g, '/')
const dir = rootPath + '/router'
describe('getRouter的测试', () => {
  test('测试正则工具:parseRouterPath', () => {
    const st = "  path: '/form/base-form',"
    const pathSt = parseRouterPath(st)
    expect(pathSt).toBe('/form/base-form')
  })
  test('测试正则工具:parseComponentPath', () => {
    const st = "  component: () => import('@/unuse/components/user-rulerts.vue'),"
    const componentSt = parseComponentPath(st)
    expect(componentSt).toBe('@/unuse/components/user-rulerts.vue')
  })
  test('getRouter--获取路由', async () => {
    const p = rootPath + '/router/index.js'
    const arrs = await getRouter(p)
    const routerArrs = [
      {
        path: '/dashboard/analysis',
        component: '@/unuse/components/test2/HelloWorld.vue'
      },
      { path: '/app', component: '@/unuse/App' },
      {
        path: '/form/base-form',
        component: '@/unuse/components/user-rulerts.vue'
      }
    ]
    expect(arrs).toMatchObject(routerArrs)
  })

  test('getRouterFilePath--递归获取路由数组', async () => {
    const arrs = await getRouterFilePath(dir)
    const routerArrs = [rootPath + '/router/container/index.js', rootPath + '/router/index.js']
    expect(arrs).toMatchObject(routerArrs)
  })

  test('getAllRouter--获取所有路由', async () => {
    const arrs = await getAllRouter(dir)
    const routerArrs = [
      {
        component: '@/unuse/components/test/deep/user.vue',
        path: 'test/deep/user'
      },
      {
        component: '@/unuse/components/test2/HelloWorld.vue',
        path: '/dashboard/analysis'
      },
      {
        component: '@/unuse/App',
        path: '/app'
      },
      {
        component: '@/unuse/components/user-rulerts.vue',
        path: '/form/base-form'
      }
    ]
    expect(arrs).toMatchObject(routerArrs)
  })
})
