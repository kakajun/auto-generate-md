/**
 *================================================
 *@date:2022/04/04
 *@author:mj
 *@desc:给路由文件打标记, 把标记打到最后,因为头部已经给了注释
 *
 *================================================
 */
import fs from 'fs'
import { ItemType } from './get-file'
import { setFolder, markWriteFile } from './mark-write-file'
import createDebugger from 'debug'
const debug = createDebugger('mark-file')
debug.enabled = false
//1. 整理要分类的路由,搞个数组对象分类
const classifiedRouting = [
  {
    name: '1工程',
    router: [
      {
        path: '/about',
        name: 'about',
        // 路由必须都是绝对路径
        component: '@/App.vue'
      }
    ]
  }
]
/**
 * @desc: 标记文件主程序
 * @author: majun
 * @param {ItemType} nodes
 * @param {string} rootPath
 */
export default function markFile(nodes: ItemType[], rootPath: string) {

  // 外层循环要分类的路由
  classifiedRouting.forEach((ele) => {
    // 这里循环打标记的路由
    ele.router.forEach((obj: { component: any }) => {
      const path = obj.component
      const renamePath = path.replace(/\//g, '\\')
      // 路径转绝对路径
      let absolutePath = renamePath.replace('@', rootPath)
      // 打标记
      setmark(absolutePath, ele.name)
      // 递归打上子集所有
      setNodeMark(nodes, ele.name, absolutePath)
      // 建分类包
      setFolder(rootPath, ele.name)
      // 对打上标记的文件进行分类写入
      markWriteFile(nodes, ele.name, absolutePath, rootPath)
    })
  })
}

/**
 * @desc: 分离一个递归调用的mark函数
 * @author: majun
 */
function setNodeMark(nodes: Array<ItemType>, name: string, path: string) {
  debug('入参: ', name, path)
  // 通过文件地址, 找到nodes的依赖地址, 把依赖文件也打标记
  const node = findNodes(nodes, path)
  // debug('查找的node: ', node)
  if (node && node.imports) {
    // 标记归属设置
    node.belongTo.push(name)
    // 找到有子文件了,循环它
    for (let index = 0; index < node.imports.length; index++) {
      const element = node.imports[index]
      debug('依赖文件: ', element)
      // 如果文件存在
      if (fs.existsSync(path)) {
        // 打标记
        setmark(element, name)
        // 继续递归,直到子文件没有子文件
        setNodeMark(nodes, name, element)
      } else {
        console.error('文件不存在', path)
      }
    }
  }
}

/**
 * @desc: 递归通过文件全名找节点
 * @author: majun
 * @param {*} nodes
 * @param {*} path
 */
export function findNodes(nodes: Array<ItemType>, path: string): ItemType | null {
  let node = null
  // 里面有/符号的要替换为\, 不然后面全等不了
  const renamePath = path.replace(/\//g, '\\')
  function find(nodes: Array<ItemType>) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index]
      if (element.children) find(element.children)
      // debug(element.fullPath, '=====', renamePath)
      if (element.fullPath === renamePath) node = element
    }
  }
  find(nodes)
  return node
}

/**
 * @desc: 给文件标记
 * @author: majun
 * @param {string} file
 * @param {string} name
 */
function setmark(file: string, name: string) {
  debug(file, name)
  let fileStr = fs.readFileSync(file, 'utf-8')
  fileStr = fileStr + '//' + name + '\n'
  fs.writeFile(file, fileStr, { encoding: 'utf8' }, () => {
    debug('mark successful-------' + file)
  })
}
