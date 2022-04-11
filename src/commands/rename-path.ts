/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
import fs from 'fs'
import { ItemType } from './get-file'
import { checkCamelFile, toKebabCase, replaceName } from './rename-kebab-case'
import createDebugger from 'debug'
import path from 'path';
const debug = createDebugger('mark-file')
const rootPath = process.cwd().replace(/\\/g, '/')
debug.enabled = false
interface fileObjType {
  [key: string]: any
}
let fileObj = {} as fileObjType // 搞个全局变量接收
/**
 * @desc: 循环node, 改文件, 改依赖, 思路:循环每个文件, 并把import 里面不合格的命名改合格
 * @author: majun
 */
export async function renamePath(nodes: ItemType[]) {
  async function getNode(nodes: ItemType[]) {
    for (let index = 0; index < nodes.length; index++) {
      const ele = nodes[index]
      if (ele.children) {
        await renameFold(ele)
        await getNode(ele.children)
      } else {
        await renameFile(ele)
      }
    }
  }
  await getNode(nodes)
  writeFile()  // 写出来
}

/**
 * @desc: 重命名文件夹
 * @author: majun
 * @param {ItemType} node
 */
export async function renameFold(node: ItemType) {
  if (checkCamelFile(node.fullPath)) {
     replaceName(node.fullPath,)
   }
}

/**
 * @desc: 重命名文件
 * @author: majun
 * @param {ItemType} node
 */
 export async function renameFile(node: ItemType) {
   if (checkCamelFile(node.fullPath)) {
     const suffix = ['.js', '.vue'] // 这里只重命名js和vue文件
     const lastName = path.extname(node.fullPath)
     let flag = suffix.some((item) => lastName.indexOf(item) > -1)
     if (flag) {
       // 写入file
       let fileName = path.parse(node.fullPath).base
       const newFileName = toKebabCase(fileName)
       fileObj[fileName] = newFileName
       // 修改文件名
       await replaceName(node.fullPath)
     }
   }
 }

/**
 * 将修改的文件数据写入file
 * @param fileName 文件名
 */
function writeFile() {
  return new Promise<void>((resolve) => {
    fs.writeFile(rootPath+'./data.json', JSON.stringify(fileObj), 'utf8', (err) => {
      if (err) {
        console.warn(err)
      }
      resolve()
    })
  })
}
