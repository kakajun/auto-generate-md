import fs from 'fs'
import createDebugger from 'debug'
import logger from '../shared/logger'
import path from 'path'
const debug = createDebugger('get-file')
debug.enabled = false
const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * @desc: 递归获取路由数组
 * @author: majun
 */
export function getRouterFilePath() {
  const dir = rootPath + '/router'
  let routes: any[] = []
  function finder(p: string) {
    let files = fs.readdirSync(p)
    files.forEach((val) => {
      let fPath = path.join(p, val).replace(/\\/g, '/')
      let stats = fs.statSync(fPath)
      if (stats.isDirectory()) finder(fPath)
      if (stats.isFile()) routes.push(fPath)
    })
  }
  finder(dir)
  return routes
}

/**
 * @desc: 获取所有路由
 * @author: majun
 */
export function getAllRouter() {
  const arrs = getRouterFilePath()
  const routers: { path: string; component: string; }[] = []
  for (let index = 0; index < arrs.length; index++) {
    const p = arrs[index]
     let itemArrs = getRouter(p)
     routers.push(...itemArrs)
  }
  return routers
}
/**
 * @desc: 得到路由
 * @author: majun
 */
export function getRouter(routerPath:string) {
  let routers = []
  let path = ''
  if (fs.existsSync(routerPath)) {
    const str = fs.readFileSync(routerPath, 'utf-8')
    const sarrs = str.split(/[\n]/g)
    for (let index = 0; index < sarrs.length; index++) {
      const st = sarrs[index]
      if (st.indexOf('//') > -1) continue // 打了注释的不要
      //  path: '/form/base-form'  匹配这样子的path
      const pathReg = /path: [\'|\"](.*)[\'|\"]/
      const pathStrs = st.match(pathReg)
      if (pathStrs) {
        path = pathStrs[1]
      }
      // 用正则匹配出所有 component: () => import( )中的组件
      const reg = /component: \(\) => import\([\'|\"](.*)[\'|\"]\)/
      const impStr = st.match(reg)
      if (impStr) {
        routers.push({
          path,
          component: impStr[1]
        })
        debug(impStr[1])
      }
    }
  }
  return routers
}

/**
 * @desc: 获取要操作的路由
 * @author: majun
 */
export function getRouterArrs() {
  let pathName = rootPath + '/classify.js'
  let routers = null
  if (fs.existsSync(pathName)) {
    routers = require(pathName)
  } else {
    // 如果没有classify,那么直接找路由
    routers = [
      {
        name: 'plan',
        router: getAllRouter()
      }
    ]
  }
  if (!routers) {
    logger.error('跟路径没发现有classify.js,并且src里面没有router文件, 现在退出')
    process.exit(1)
  }
  return routers
}
