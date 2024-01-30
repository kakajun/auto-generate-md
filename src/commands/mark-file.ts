/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
import fs from 'fs'
import { readFile, writeFile } from 'fs/promises'
import type { ItemType, RouterItem } from '../types'
import { markWriteFile } from './mark-write-file'
import { createConsola } from 'consola'
const logger = createConsola({
  level: 4
})
const rootPath = process.cwd().replace(/\\/g, '/')
type Routers = Array<RouterItem>
/**
 * @desc: 标记文件主程序
 * @param {ItemType} nodes
 * @param {string} routers
 */
export async function markFile(nodes: ItemType[], routers: Routers) {
  for (let i = 0; i < routers.length; i++) {
    const ele = routers[i]
    for (let j = 0; j < ele.router.length; j++) {
      const obj = ele.router[j]
      const pathN = obj.component
      logger.info(`准备处理${obj.path}`)
      // 路径转绝对路径
      const absolutePath = pathN.replace('@', rootPath)
      // 递归打上子集所有
      await setNodeMark(nodes, ele.name, absolutePath)
    }
  }
}

/**
 * @desc: 标记文件主程序
 * @param {ItemType} nodes
 * @param {string} rootPath
 */
export async function witeMarkFile(nodes: ItemType[], routers: Routers) {
  for (let index = 0; index < routers.length; index++) {
    const ele = routers[index]
    // 这里循环打标记的路由
    for (let j = 0; j < ele.router.length; j++) {
      const obj = ele.router[j]
      const pathN = obj.component
      // 路径转绝对路径
      const absolutePath = pathN.replace('@', rootPath)
      // 对打上标记的文件进行分类写入
      await markWriteFile(nodes, ele.name, absolutePath)
    }
  }
}

/**
 * @desc: 分离一个递归调用的mark函数
 */
export async function setNodeMark(nodes: ItemType[], name: string, path: string) {
  logger.info('setNodeMark入参: ', name, path)
  // 通过文件地址, 找到nodes的依赖地址, 把依赖文件也打标记
  const node = findNodes(nodes, path)
  if (node) {
    // 打标记
    await setmark(path, name)
  }
  // logger.info('查找的node: ', node)
  if (node && node.imports) {
    // 标记归属设置
    if (node.belongTo.indexOf(name) > -1) return // 已经分析过该文件了, 就不再分析,否则会死循环
    node.belongTo.push(name)
    // 找到有子文件了,循环它
    for (let index = 0; index < node.imports.length; index++) {
      const element = node.imports[index]
      // logger.info('依赖文件: ', element)
      // 如果文件存在
      if (fs.existsSync(path)) {
        // 继续递归,直到子文件没有子文件
        await setNodeMark(nodes, name, element)
      } else {
        logger.error(`文件不存在: ${path}`)
      }
    }
  }
}

/**
 * @desc: 递归通过文件全名找节点
 * @param {*} nodes
 * @param {*} path
 */
export function findNodes(nodes: ItemType[], path: string): ItemType | null {
  let node = null
  function find(objs: ItemType[]) {
    for (let index = 0; index < objs.length; index++) {
      const element = objs[index]
      if (element.children) find(element.children)
      if (element.fullPath === path) node = element
    }
  }
  find(nodes)
  return node
}

/**
 * 给文件添加标记
 * @param {string} file - 文件路径
 * @param {string} name - 标记名称
 */
export async function setmark(file: string, name: string): Promise<void> {
  try {
    // 读取文件内容
    let fileStr = await readFile(file, 'utf-8')
    const mark = `//${name}\n`

    // 检查文件是否已经包含标记
    if (!fileStr.startsWith(mark)) {
      // 在文件内容前添加标记
      fileStr = mark + fileStr
      await writeFile(file, fileStr)
      logger.info(`Mark added successfully to: ${file}`)
    }
  } catch (error) {
    // 提供详细的错误信息
    logger.error(`Error marking file: ${file}, Error: ${error}`)
  }
}

/**
 * @desc: 递归所有文件,删除所有标记

 * @param {Array} nodes
 */
export async function deletMarkAll(nodes: ItemType[], name: string): Promise<void> {
  async function find(objs: ItemType[]) {
    for (let index = 0; index < objs.length; index++) {
      const element = objs[index]
      if (element.children) find(element.children)
      else await deletMark(element.fullPath, name)
    }
  }
  await find(nodes)
}

/**
 * @desc: 给文件标记

 * @param {string} file
 * @param {string} name
 */
export async function deletMark(file: string, name: string): Promise<string> {
  let fileStr = ''
  try {
    fileStr = await readFile(file, 'utf-8')
    const sarr = fileStr.split(/[\n]/g)
    for (let index = 0; index < sarr.length; index++) {
      const ele = sarr[index]
      if (ele.indexOf('//' + name) > -1) {
        sarr.splice(index, 1)
        index-- //i需要自减，否则每次删除都会讲原数组索引发生变化
      }
    }
    fileStr = sarr.join('\n')
    await writeFile(file, fileStr, { encoding: 'utf8' })
    logger.success('delete mark successful-------' + file)
    return fileStr
  } catch (error) {
    logger.error('删除标记的文件不存在: ', file)
  }
  return ''
}
