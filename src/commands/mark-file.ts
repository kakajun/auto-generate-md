/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
import fs from 'fs'
import { ItemType } from './get-file'
import {  markWriteFile } from './mark-write-file'
import createDebugger from 'debug'
const debug = createDebugger('mark-file')
debug.enabled = true
type classifyType = [
  {
    name: string
    router: [
      {
        path: string
        name: string
        // 路由必须都是绝对路径
        component: string
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
export async function markFile(nodes:  Array<ItemType>, routers: classifyType) {
  for (let i = 0; i < routers.length; i++) {
    const ele = routers[i]
    for (let j = 0; j < ele.router.length; j++) {
      const obj = ele.router[j]
      const pathN = obj.component
      const renamePath = pathN.replace(/\//g, '\\')
      // 路径转绝对路径
      let absolutePath = renamePath.replace('@', process.cwd())
      // 递归打上子集所有
      await setNodeMark(nodes, ele.name, absolutePath)
    }
  }
}

/**
 * @desc: 标记文件主程序
 * @author: majun
 * @param {ItemType} nodes
 * @param {string} rootPath
 */
export  function witeFile(nodes:  Array<ItemType>, routers: classifyType) {
  routers.forEach( (ele) => {
    // 这里循环打标记的路由
    ele.router.forEach(async (obj: { component: any }) => {
      const pathN = obj.component
      const renamePath = pathN.replace(/\//g, '\\')
      // 路径转绝对路径
      let absolutePath = renamePath.replace('@', process.cwd())
      // 对打上标记的文件进行分类写入
      await markWriteFile(nodes, ele.name, absolutePath)
    })
  })
}

/**
 * @desc: 分离一个递归调用的mark函数
 * @author: majun
 */
export async function setNodeMark(nodes: Array<ItemType>, name: string, path: string) {
  debug('setNodeMark入参: ', name, path)
  // 通过文件地址, 找到nodes的依赖地址, 把依赖文件也打标记
  const node = findNodes(nodes, path)
  if (node) {
    // 打标记
    await setmark(path, name)
  }
  debug('查找的node: ', node)
  if (node && node.imports) {
    // 标记归属设置
    if (node.belongTo.indexOf(name)>-1) return  // 已经分析过该文件了, 就不再分析,否则会死循环
      node.belongTo.push(name)
    // 找到有子文件了,循环它
    for (let index = 0; index < node.imports.length; index++) {
      const element = node.imports[index]
      debug('依赖文件: ', element)
      // 如果文件存在
      if (fs.existsSync(path)) {
        // 继续递归,直到子文件没有子文件
       await setNodeMark(nodes, name, element)
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
 return new Promise<void>((resolve, reject) => {
   try {
     let fileStr = fs.readFileSync(file, 'utf-8')
     if (fileStr.indexOf('//' + name + '\n')===0) return  // 打过标记了,就不打了
     // 直接打上标记
     fileStr = '//' + name + '\n' + fileStr
     fs.writeFile(file, fileStr, { encoding: 'utf8' }, () => {
       debug('mark successful-------' + file)
       resolve()
     })
   } catch (error) {
     console.error('给文件打标记的文件不存在: ', file)
     reject()
   }
 })
}

/**
 * @desc: 递归所有文件
 * @author: majun
 * @param {Array} nodes
 */
export function deletMarkAll(nodes: Array<ItemType>, name: string) {
  function find(nodes: Array<ItemType>) {
    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index]
      if (element.children) find(element.children)
      else deletMark(element.fullPath, name)
    }
  }
  find(nodes)
}

/**
 * @desc: 给文件标记
 * @author: majun
 * @param {string} file
 * @param {string} name
 */
export function deletMark(file: string, name: string) {
 return new Promise<string>((resolve, reject) => {
     let fileStr=''
    try {
       fileStr = fs.readFileSync(file, 'utf-8')
      let sarr = fileStr.split(/[\n]/g)
     for (let index = 0; index < sarr.length; index++) {
       const ele = sarr[index]
       if (ele.indexOf('//' + name) > -1) {
         sarr.splice(index, 1)
         index-- //i需要自减，否则每次删除都会讲原数组索引发生变化
       }
      }
      fileStr = sarr.join('\n')
      fs.writeFile(file, fileStr, { encoding: 'utf8' }, () => {
        debug('delete mark successful-------' + file)
        resolve(fileStr)
      })
    } catch (error) {
      console.error('删除标记的文件不存在: ', file)
      reject()
    }
  })
}
