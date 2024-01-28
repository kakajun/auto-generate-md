import { readdir, readFile, stat, access } from 'fs/promises'
import createDebugger from 'debug'
import { createConsola } from 'consola'
import path from 'path'
import { parseRouterPath, parseComponentPath } from '../utils/router-utils'
import type { Router, RouterItem } from '../types'
const logger = createConsola({
  level: 4 // 设置日志级别为 silent
})
const debug = createDebugger('get-file')
debug.enabled = false
const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * @desc: 递归获取路由数组
 * @author: majun
 */
export async function getRouterFilePath(dir: string): Promise<string[]> {
  const routes: string[] = []

  async function finder(p: string): Promise<void> {
    const files = await readdir(p)
    for (const val of files) {
      const fPath = path.join(p, val).replace(/\\/g, '/')
      const stats = await stat(fPath)
      if (stats.isDirectory()) {
        await finder(fPath)
      } else if (stats.isFile()) {
        routes.push(fPath)
      }
    }
  }

  await finder(dir)
  return routes
}

/**
 * @desc: 获取所有路由
 * @author: majun
 */
export async function getAllRouter(dir: string): Promise<Router[]> {
  const filePaths = await getRouterFilePath(dir)
  const routers: Router[] = []

  for (const filePath of filePaths) {
    const routerItems = await getRouter(filePath)
    routers.push(...routerItems)
  }

  return routers
}
/**
 * @desc: 得到路由
 * @author: majun
 */
export async function getRouter(routerPath: string): Promise<Router[]> {
  const routers: Router[] = []
  try {
    // 检查文件是否存在
    await access(routerPath)

    const fileContent = await readFile(routerPath, 'utf-8')
    const lines = fileContent.split(/\n/g)
    let currentPath = ''
    let currentComponent = ''

    lines.forEach((line) => {
      if (line.includes('//')) return // 跳过注释行

      const tempPath = parseRouterPath(line)
      if (tempPath) currentPath = tempPath

      const tempComponent = parseComponentPath(line)
      if (tempComponent) currentComponent = tempComponent

      if (currentPath && currentComponent) {
        routers.push({ path: currentPath, component: currentComponent })
        currentPath = ''
        currentComponent = ''
      }
    })
  } catch (error) {
    console.error('读取路由配置时出错:', error)
    // 可以根据需要处理或抛出错误
  }

  return routers
}

/**
 * @desc: 获取要操作的路由
 * @author: majun
 */
export async function getRouterArrs(): Promise<RouterItem[] | null> {
  const pathName = `${rootPath}/classify.js`
  const dir = `${rootPath}/router`
  let routers: RouterItem[] | null = null

  try {
    if (await stat(pathName)) {
      routers =await import(pathName)
    } else {
      // 如果没有classify.js，则直接找路由
      routers = [
        {
          name: 'mark',
          router: await getAllRouter(dir)
        }
      ]
    }
  } catch (error) {
    logger.error('根路径没有发现 classify.js，并且 src 里面没有 router 文件，现在退出')
    process.exit(1)
  }

  return routers
}
