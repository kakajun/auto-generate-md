// get-router.ts
import fs from 'fs'
import path from 'path'
// import { parseRouterPath, parseComponentPath } from '../utils/routerUtils'

/**
 * 从给定的路由文件中提取路由信息。
 * @param {string} routerFilePath - 路由文件的路径。
 * @return {Array} - 路由信息数组。
 */
export function getRoutesFromRouterFile(routerFilePath: string) {
  console.log(routerFilePath, 'routerFilePath')

  // const fileContent = fs.readFileSync(routerFilePath, 'utf-8')
  // const lines = fileContent.split(/\r?\n/)
  // const routes: { path: string; component: string }[] = []

  // let currentPath = ''
  // lines.forEach((line) => {
  //   const routePath = parseRouterPath(line)
  //   const component = parseComponentPath(line)

  //   if (routePath) {
  //     currentPath = routePath
  //   }

  //   if (component) {
  //     routes.push({
  //       path: currentPath,
  //       component
  //     })
  //   }
  // })

  // return routes
}

/**
 * 从项目的路由目录中提取所有路由信息。
 * @param {string} routerDirPath - 路由目录的路径。
 * @return {Array} - 所有路由信息的数组。
 */
export function getAllRoutes(routerDirPath: string): Array<any> {
  const routerFiles = fs.readdirSync(routerDirPath)
  let allRoutes: any[] = []

  routerFiles.forEach((file) => {
    const filePath = path.join(routerDirPath, file)
    if (fs.statSync(filePath).isFile()) {
      const routes = getRoutesFromRouterFile(filePath)
      allRoutes = allRoutes.concat(routes)
    }
  })

  return allRoutes
}
