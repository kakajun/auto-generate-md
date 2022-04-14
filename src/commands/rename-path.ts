/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
import fs from 'fs-extra'
import { ItemType } from './get-file'
import createDebugger from 'debug'
import path from 'path'
import { getImportName } from './change-path'
const debug = createDebugger('rename-path')
const rootPath = process.cwd().replace(/\\/g, '/')
debug.enabled = true
interface fileObjType {
  [key: string]: any
}
let fileObj = {} as fileObjType // 搞个全局变量接收

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
      if (ele.children) {
        await renameFold(ele, nodes) // 下面已递归
        // 递归
        await getNode(ele.children)
      }
    }
  }
  await getNode(nodes)
  await writeFileDatas('/dataFold.json')
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
        await renameFile(ele, nodes)
        // 重写文件的import
        await rewriteFile(ele)
      }
    }
  }
  await getNode(nodes)
  await writeFileDatas('/dataFile.json')
}

function rewriteFile(node: ItemType) {
  return new Promise<void>((resolve) => {
    let writeFlag = false
    const str = fs.readFileSync(node.fullPath, 'utf-8')
    const sarr = str.split(/[\n]/g)
    for (let index = 0; index < sarr.length; index++) {
      const ele = sarr[index]
      if (ele.indexOf('import') > -1) {
        let impOldName = getImportName(ele)
        if (checkCamelFile(impOldName)) {
          // 取文件名,否则转case会出错
          let name = path.parse(impOldName).name
          const newName = toKebabCase(name)
          sarr[index] = ele.replace(name, newName)
          writeFlag = true
        }
      }
    }
    if (writeFlag) {
      let fileStr = sarr.join('\n')
      // 异步写入数据到文件
      fs.writeFile(node.fullPath, fileStr, { encoding: 'utf8' }, () => {
        console.log('Write successful-------' + node.fullPath)
        resolve()
      })
    } else {
      resolve()
    }
  })
}

/**
 * @desc: 重命名文件夹
 * @author: majun
 * @param {ItemType} node
 */
export async function renameFold(node: ItemType, nodes: ItemType[]) {
  let filename = path.parse(node.fullPath).base
  const filter = ['FMEA', 'DVP'] // 把这样子的文件夹过滤
  const falg = filter.some((item) => filename.indexOf(item) > -1)
  if (!falg && checkCamelFile(filename)) {
    const obj = await replaceName(node.fullPath)
    // 这里一定要更新node,否则后面找不到路径
    changePathName(node, obj, nodes)
  }
}
/**
 * @desc: 递归改所有路径名字
 * @author: majun
 * @param {ItemType} node
 * @param {object} obj
 */
export function changePathName(node: ItemType, obj: { newName: string; filename: string }, nodes: ItemType[]) {
  if (node.children) {
    for (let index = 0; index < node.children.length; index++) {
      const element = node.children[index]
      changePathName(element, obj, nodes)
    }
  }
  const { newName, filename } = obj
  if (node.fullPath.indexOf(filename) > -1) {
    if (node.imports.length > 0) {
      // import也要变化, 否则也会找不到路径
      const array = node.imports
      for (let j = 0; j < array.length; j++) {
        const ele = array[j]
        if (ele.indexOf(filename) > -1) {
          array[j].replace(filename, newName)
        }
      }
    }
    node.fullPath = node.fullPath.replace(filename, newName)
    debug('替换后的 node.fullPath:', node.fullPath)
  }
}

/**
 * @desc: 重命名文件
 * @author: majun
 * @param {ItemType} node
 */
export async function renameFile(node: ItemType, nodes: ItemType[]) {
  let filename = path.parse(node.fullPath).base
  if (checkCamelFile(filename)) {
    const suffix = ['.js', '.vue'] // 这里只重命名js和vue文件
    const lastName = path.extname(node.fullPath)
    let flag = suffix.some((item) => lastName === item)
    if (flag) {
      const obj = await replaceName(node.fullPath)
      // 这里一定要更新node,否则后面找不到路径
      changePathName(node, obj, nodes)
    }
  }
}

/**
 * 重命名文件 CamelCase || PascalCase => kebab-case
 * @param node 节点
 */
export function replaceName(fullPath: string) {
  let filename = path.parse(fullPath).base
  const newName = toKebabCase(filename)
  debug('newName: ', newName)
  debug('filename: ', filename)
  const oldPath = fullPath
  const newPath = oldPath.replace(filename, newName)
  return new Promise<{ newName: string; filename: string }>(async (resolve) => {
    // rename之前要判断一下,假如已经有了,那么直接拷贝过去,并且删除原来的
    const lastName = path.extname(newPath)
    if (!lastName) {
      // 文件夹, 特殊处理,要copy文件
      if (fs.existsSync(newPath)) {
        // debug('newPath: ', newPath)
        await fs.copy(fullPath, newPath)
        fs.removeSync(fullPath)  // 删除目录
        resolve({ newName, filename })
      }
    }

    fs.rename(oldPath, newPath, (err) => {
      if (err) throw err
      else console.log(filename + ' is done')
      resolve({ newName, filename })
    })
  })
}
/**
 * 将修改的文件数据写入file
 * @param fileName 文件名
 */
function writeFileDatas(name: string) {
  return new Promise<void>((resolve) => {
    fs.writeFile(rootPath + name, JSON.stringify(fileObj), 'utf8', (err) => {
      if (err) {
        console.warn(err)
      }
      resolve()
    })
  })
}
