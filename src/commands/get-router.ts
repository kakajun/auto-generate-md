import fs from 'fs'
const rootPath = process.cwd().replace(/\\/g, '/')
/**
 * @desc: 得到路由
 * @author: majun
 */
export function getRouter() {
  const routerPath = rootPath + '/router/index.js';
  let routers = []
  let path=''
  if (fs.existsSync(routerPath)) {
    const str = fs.readFileSync(routerPath, 'utf-8')
    const sarrs = str.split(/[\n]/g)
    for (let index = 0; index < sarrs.length; index++) {
      const st = sarrs[index]
      if (st.indexOf('//') > -1) continue // 打了注释的不要
      //  path: '/form/base-form'  匹配这样子的path
      const pathReg = /path: (.*),/
      const pathStrs = st.match(pathReg)
      if (pathStrs) {
        path = pathStrs[1]
      }
      // 用正则匹配出所有 component: () => import( )中的组件
      const reg = /component: \(\) => import\((.*)\)/
      const impStr = st.match(reg)
      if (impStr) {
        routers.push({
          path,
          component: impStr[1]
        })
        console.log(impStr[1])
      }
    }
  }
  return routers
}
