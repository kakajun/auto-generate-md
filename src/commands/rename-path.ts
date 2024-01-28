/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
import fs from 'fs-extra'
import type { ItemType } from '../types'
import createDebugger from 'debug'
import path from 'path'
import { createConsola } from 'consola'
import {getDependencies} from '../utils/routerUtils';
import { getImportName } from './change-path'
const logger = createConsola({
  level: 4 // 设置日志级别为 silent
})
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('rename-path')
debug.enabled = false

/**
 * 将单个字符串的首字母小写
 * @param str 字符串
 */
function fistLetterLower(str: string | String) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function toKebabCase(str: string) {
  const regex = /[A-Z]/g
  return fistLetterLower(str).replace(regex, (word: string) => {
    return '-' + word.toLowerCase()
  })
}
/**
 * 检测驼峰文件名
 * @param fileName 文件名
 */
export function checkCamelFile(fileName: string) {
  return /([a-z])([A-Z])/.test(fileName) || /([A-Z])/.test(fileName)
}

/**
 * @desc: 循环node, 改文件夹, 并把import 里面不合格的命名改合格
 * @author: majun
 */
export async function renameFoldPath(nodes: ItemType[]) {
  async function getNode(cpNodes: ItemType[]) {
    for (let index = 0; index < cpNodes.length; index++) {
      const ele = cpNodes[index]
      await renameFold(ele) // 下面已递归
      if (ele.children) {
        // 递归
        await getNode(ele.children)
      }
    }
  }
  await getNode(nodes)
}

/**
 * @desc: 循环node, 改文件, 改依赖, 思路:循环每个文件, 并把import 里面不合格的命名改合格
 * @author: majun
 */
export async function renameFilePath(nodes: ItemType[]) {
  async function getNode(cpNodes: ItemType[]) {
    for (let index = 0; index < cpNodes.length; index++) {
      const ele = cpNodes[index]
      if (ele.children) {
        // 递归
        await getNode(ele.children)
      } else {
        // 重命名文件
        await renameFile(ele)
        // 重写文件的import
        await rewriteFile(ele)
      }
    }
  }
  await getNode(nodes)
}

async function rewriteFile(node: ItemType) {
  let writeFlag = false
  const str = fs.readFileSync(node.fullPath, 'utf-8')
  const sarr = str.split(/[\n]/g)
   const packageJsonPath = path.join(rootPath, 'package.json');
   let  dependencies=await getDependencies(packageJsonPath)
    // 循环处理每一行
  for (let index = 0; index < sarr.length; index++) {
    const ele = sarr[index]
    if (ele.indexOf('from') > -1) {
      const impOldName = getImportName(ele, dependencies)
      if (checkCamelFile(impOldName)) {
        // 取文件名,否则转case会出错
        const name = path.parse(impOldName).name
        const newName = toKebabCase(name)
        // 这里替换有可能把头也替换了, 所以切一下
        //比如 import moduleName from 'moduleName'  会只替换前一个   "import moduleName from 'moduleName'".split('from')
        const s = ele.split('from')
        sarr[index] = `${s[0]}from${s[1].replace(name, newName)}`
        writeFlag = true
      }
    }
  }
  if (writeFlag) {
    const fileStr = sarr.join('\n')
    try {
      // 异步写入数据到文件
      await fs.writeFile(node.fullPath, fileStr, { encoding: 'utf8' })
      logger.success(`rewriteFile successful-------: ${node.fullPath}`)
    } catch (error) {
      logger.error(`写入文件失败,地址不存在: ${node.fullPath}`)
    }
  }
}

/**
 * @desc: 重命名文件夹
 * @author: majun
 * @param {ItemType} node
 */
export async function renameFold(node: ItemType) {
  const filename = path.parse(node.fullPath).base
  debug('filename111: ', filename)
  const filter = ['FMEA', 'DVP'] // 把这样子的文件夹过滤
  const falg = filter.some((item) => filename.indexOf(item) > -1)
  if (!falg && checkCamelFile(filename)) {
    // 这里只处理文件夹
    if (node.isDir) {
      const obj = await replaceName(node.fullPath)
      // 这里一定要更新node,否则后面找不到路径
      changePathFold(node, obj)
    }
  }
}

/**
 * @desc: 重命名后, 子文件都会存在路径的更改,也就要递归处理(既可以处理文件夹, 也可以处理文件)
 * @author: majun
 */
export function changePathFold(node: ItemType, obj: { newName: string; filename: string }) {
  const { newName, filename } = obj
  if (node.children) {
    for (let index = 0; index < node.children.length; index++) {
      const ele = node.children[index]
      // 递归处理
      changePathFold(ele, obj)
    }
  }
  node.fullPath = node.fullPath.replace(filename, newName)
  debug(node.fullPath, newName)
  node.name = node.name.replace(filename, newName)
}
/**
 * @desc: 递归改所有路径名字
 * @author: majun
 * @param {ItemType} node
 * @param {object} obj
 */
export function changePathName(node: ItemType, obj: { newName: string; filename: string }) {
  const { newName, filename } = obj
  if (node.fullPath.indexOf(filename) > -1) {
    if (node.imports.length > 0) {
      // import也要变化, 否则也会找不到路径
      const array = node.imports
      for (let j = 0; j < array.length; j++) {
        const ele = array[j]
        debug('import-ele: ', ele)
        array[j] = toKebabCase(ele)
        debug('更换import: ', array[j])
      }
    }
    node.fullPath = node.fullPath.replace(filename, newName)
    node.name = node.name.replace(filename, newName)
    debug('替换后的 node.fullPath:', node.fullPath)
  }
}

/**
 * @desc: 重命名文件
 * @author: majun
 * @param {ItemType} node
 */
export async function renameFile(node: ItemType) {
  const filename = path.parse(node.fullPath).base
  if (checkCamelFile(filename)) {
    const suffix = ['.js', '.vue', '.tsx'] // 这里只重命名js和vue文件
    const lastName = path.extname(node.fullPath)
    const flag = suffix.some((item) => lastName === item)
    if (flag) {
      const obj = await replaceName(node.fullPath)
      // 这里一定要更新node,否则后面找不到路径
      changePathName(node, obj)
    }
  }
}

/**
 * 重命名文件夹 CamelCase || PascalCase => kebab-case
 * @param node 节点
 */
export async function replaceName(fullPath: string) {
  const filename = path.parse(fullPath).base
  const newName = toKebabCase(filename)
  debug('newName: ', newName)
  debug('filename: ', filename)
  const oldPath = fullPath
  const newPath = oldPath.replace(filename, newName)
  // rename之前要判断一下,假如已经有了,那么直接拷贝过去,并且删除原来的
  const lastName = path.extname(newPath)
  if (!lastName) {
    // 文件夹, 特殊处理,要copy文件
    if (fs.existsSync(newPath)) {
      // debug('newPath: ', newPath)
      await fs.copy(fullPath, newPath)
      fs.removeSync(fullPath) // 删除目录
      return { newName, filename }
    }
  }
  debug(oldPath, newPath, 'oldPath, newPath')
  try {
    const flag = fs.existsSync(oldPath)
    if (flag) {
      console.log(oldPath, '改名为: ', newPath, '成功')
      await fs.rename(oldPath, newPath)
    } else {
      logger.error(`文件${oldPath}不存在重命名干嘛?`)
    }
    logger.info(filename + ' is reneme done')
    return { newName, filename }
  } catch (error) {
    throw error
  }
}
