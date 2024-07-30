/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
import fs from 'fs-extra'
import type { ItemType } from '../types'
import {
  readFile
  //  writeFile
} from 'fs/promises'
import path from 'path'
import { createConsola } from 'consola'
import { getDependencies } from '../utils/router-utils'
import { getImportName } from './change-path'
const logger = createConsola({
  level: 4
})
const rootPath = process.cwd().replace(/\\/g, '/')
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

export function toCameCase(name: string) {
  // 使用正则表达式匹配中划线和随后的字符，同时将它们转换为大写
  let formattedName = name.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase())

  // 如果第一个字母不是大写，创建一个新的字符串并将其转换为大写
  if (formattedName[0] === formattedName[0].toLowerCase()) {
    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1)
  }

  return formattedName
}
/**
 * 检测驼峰文件名
 * @param fileName 文件名
 */
export function checkCamelFile(fileName: string) {
  return /([a-z])([A-Z])/.test(fileName) || /([A-Z])/.test(fileName)
}

/**
 * 检测大驼峰文件名
 * @param fileName 文件名
 */
export function checkUperCamelFile(fileName: string) {
  return /([A-Z])/.test(fileName)
}

/**
 * @desc: 循环node, 改文件夹, 并把import 里面不合格的命名改合格
 */
export async function renameFoldPath(nodes: ItemType[], isCamelCase?: Boolean) {
  async function getNode(cpNodes: ItemType[]) {
    for (let index = 0; index < cpNodes.length; index++) {
      const ele = cpNodes[index]
      isCamelCase ? await renameFold(ele, true) : await renameFold(ele) // 下面已递归
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

export async function renameCamelCaseFilePath(nodes: ItemType[]) {
  async function getNode(cpNodes: ItemType[]) {
    for (let index = 0; index < cpNodes.length; index++) {
      const ele = cpNodes[index]
      if (ele.children) {
        // 递归
        await getNode(ele.children)
      } else {
        // 重命名文件
        await renameCamelCaseFile(ele)
        // 重写文件的import
        await rewriteFile(ele, true)
      }
    }
  }
  await getNode(nodes)
}

async function rewriteFile(node: ItemType, isCamelCase?: Boolean) {
  let writeFlag = false
  try {
    const fileContent = await readFile(node.fullPath, 'utf-8')
    const lines = fileContent.split(/\n/g)

    const packageJsonPath = path.join(rootPath, 'package.json')
    const dependencies = await getDependencies(packageJsonPath)

    for (let index = 0; index < lines.length; index++) {
      const importLine = lines[index]
      if (importLine.includes('from')) {
        const importModuleName = getImportName(importLine, dependencies)

        if (isCamelCase) {
          if (checkUperCamelFile(importModuleName)) {
            const newName = toCameCase(path.parse(importModuleName).name)
            const [beforeFrom, afterFrom] = importLine.split('from')
            lines[index] = `${beforeFrom}from${afterFrom.replace(importModuleName, newName)}`
            writeFlag = true
          }
        } else if (checkCamelFile(importModuleName)) {
          const newName = toKebabCase(path.parse(importModuleName).name)
          const [beforeFrom, afterFrom] = importLine.split('from')
          lines[index] = `${beforeFrom}from${afterFrom.replace(importModuleName, newName)}`
          writeFlag = true
        }
      }
    }

    if (writeFlag) {
      const updatedFileContent = lines.join('\n')
      try {
        await fs.writeFile(node.fullPath, updatedFileContent, { encoding: 'utf8' })
        logger.success(`Rewrote file successfully: ${node.fullPath}`)
      } catch (writeError) {
        logger.error(`Failed to write file: ${node.fullPath}`, writeError)
      }
    }
  } catch (readError) {
    logger.error(`Failed to read file: ${node.fullPath}`, readError)
  }
}

/**
 * @desc: 重命名文件夹
 * @param {ItemType} node
 */
export async function renameFold(node: ItemType, isCamelCase?: boolean) {
  const filename = path.parse(node.fullPath).base

  const shouldRename = isCamelCase ? checkUperCamelFile(filename) : checkCamelFile(filename)
  if (shouldRename && node.isDir) {
    const obj = await replaceName(node.fullPath, isCamelCase)
    changePathFold(node, obj)
  }
}

/**
 * @desc: 重命名后, 子文件都会存在路径的更改,也就要递归处理(既可以处理文件夹, 也可以处理文件)
 */
export function changePathFold(node: ItemType, renameInfo: { newName: string; filename: string }): void {
  const { newName, filename } = renameInfo

  // If the node has children, recursively call this function on each child.
  if (node.children) {
    for (const childNode of node.children as ItemType[]) {
      changePathFold(childNode, renameInfo)
    }
  }

  // Update the full path and name of the current node.
  node.fullPath = node.fullPath.replace(filename, newName)
  node.name = node.name.replace(filename, newName)

  // Optionally, log once at the outermost call instead of in every recursion.
  // This can be controlled by a flag or condition check if needed.
  // if (isOutermostCall) {
  //   logger.info(node.fullPath, newName);
  // }
}

/**
 * @desc: 递归改所有路径名字
 * @param {ItemType} node
 * @param {object} obj
 */
export function changePathName(node: ItemType, obj: { newName: string; filename: string }, isCamelCase?: Boolean) {
  const { newName, filename } = obj
  if (node.fullPath.indexOf(filename) > -1) {
    if (node.imports.length > 0) {
      // import也要变化, 否则也会找不到路径
      const array = node.imports
      for (let j = 0; j < array.length; j++) {
        const ele = array[j]
        logger.info('import-ele: ', ele)
        array[j] = isCamelCase ? toCameCase(filename) : toKebabCase(ele)
        logger.info('更换import: ', array[j])
      }
    }
    node.fullPath = node.fullPath.replace(filename, newName)
    node.name = node.name.replace(filename, newName)
    logger.success('替换后的 node.fullPath:', node.fullPath)
  }
}

/**
 * @desc: 重命名文件
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

export async function renameCamelCaseFile(node: ItemType) {
  const filename = path.parse(node.fullPath).base
  if (!checkUperCamelFile(filename)) {
    const suffix = ['.vue'] // 这里只重命名vue文件为大驼峰
    const lastName = path.extname(node.fullPath)
    const flag = suffix.some((item) => lastName === item)
    if (flag) {
      const obj = await replaceName(node.fullPath, true)
      // 这里一定要更新node,否则后面找不到路径
      changePathName(node, obj, true)
    }
  }
}

/**
 * 重命名文件夹 CamelCase || PascalCase => kebab-case
 * @param fullPath '/path/to/myFile.txt'
 * @return {newName:'my-file.txt','myFile.txt'}
 */
export async function replaceName(fullPath: string, isCamelCase?: Boolean) {
  const filename = path.parse(fullPath).base
  const newName = isCamelCase ? toCameCase(filename) : toKebabCase(filename)

  try {
    const oldPath = fullPath
    console.log('oldPath: ', oldPath)
    const newPath = oldPath.replace(filename, newName)
    const lastName = path.extname(newPath)
    if (!lastName) {
      // 处理目录
      if (fs.existsSync(newPath)) {
        await fs.copy(oldPath, newPath)
        await fs.rm(oldPath, { recursive: true }) // 删除目录
        return { newName, filename }
      }
    }
    // 处理文件
    if (await fs.pathExists(oldPath)) {
      await fs.rename(oldPath, newPath)
      logger.success(`${oldPath} renamed to: ${newPath}`)
    } else {
      logger.error(`File ${oldPath} does not exist.`)
    }
    logger.info(`${filename} is renamed done`)
    return { newName, filename }
  } catch (error) {
    logger.error(`Error renaming file/directory: ${error}`)
    throw error
  }
}
