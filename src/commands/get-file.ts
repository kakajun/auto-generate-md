/* 获取文件相关方法 */
import fs from 'fs'
import path from 'path'
import { readFile, readdir } from 'fs/promises'
import { createConsola } from 'consola'
import { changeImport } from './change-path'
import { getDependencies } from '../utils/router-utils'
import type { ItemType, OptionType } from '../types'
import { env } from 'node-environment'
const rootPath = process.cwd().replace(/\\/g, '/')
const isDev = env() === 'development'
const logger = createConsola({
  level: 4
})
//File filtering -- full name with suffix required  文件过滤--需要全称带后缀
const ignore = [
  'es6',
  'lib',
  'jest.config.js',
  'router',
  'img',
  'styles',
  'node_modules',
  'LICENSE',
  '.git',
  '.github',
  'dist',
  '.husky',
  '.vscode',
  '.eslintrc.js',
  'readme-file.js',
  'readme-md.js'
]

/**
 * @description:Gets the header comment of the file  获取文件的头部注释
 * @param {*} fullPath
 * @return {*}
 */
export async function getFile(fullPath: string) {
  const str = await readFile(fullPath, 'utf-8')
  const size = str.length
  const sarr = str.split(/[\n]/g)
  const rowSize = sarr.length
  const imports = await getImport(sarr, fullPath)
  const f =
    sarr[0].indexOf('eslint') === -1 &&
    (sarr[0].indexOf('-->') > -1 || sarr[0].indexOf('*/') > -1 || sarr[0].indexOf('//') > -1)
      ? sarr[0]
      : ''
  return {
    note: f.replace(/<\/?[^>]*>|(\n|\r)/g, ''), // 去掉尾巴换行符号
    size,
    rowSize,
    imports
  }
}

/**
 * @desc: 这是初始化时就获取每个文件依赖的方法, 但要求先补全后缀,否则不灵
 * @param {any} sarr
 * @param {string} fullPath
 */
export async function getImport(sarr: any[], fullPath: string) {
  const packageJsonPath = path.join(rootPath, 'package.json')
  const dependencies = await getDependencies(packageJsonPath)
  // 这里获取每个文件的import路径
  const imports: string[] = []
  sarr.forEach((ele: string) => {
    if (ele.indexOf('from') > -1) {
      const obj = changeImport(ele, fullPath, dependencies)
      if (obj) {
        const { absoluteImport } = obj
        if (absoluteImport) {
          imports.push(absoluteImport)
        }
      }
    }
  })
  return imports
}

// 获取文件或目录的信息
function getFileInfo(dir: string, item: string, level: number): ItemType {
  const fullPath = path.join(dir, item)
  const isDir = fs.lstatSync(fullPath).isDirectory()
  return {
    name: item,
    isDir,
    level,
    note: '',
    imports: new Array(),
    belongTo: new Array()
  } as ItemType
}

// 对文件和目录进行排序
function sortFiles(files: ItemType[]): ItemType[] {
  return files.sort((a, b) => {
    if (!a.isDir && b.isDir) return 1
    if (a.isDir && !b.isDir) return -1
    return 0
  })
}

// 处理目录
async function handleDirectory(
  dir: string,
  item: ItemType,
  option: OptionType | undefined,
  level: number,
  nodes: ItemType[]
): Promise<void> {
  await getFileNodes(path.join(dir, item.name), option, (item.children = []), level + 1)
  item.fullPath = path.join(dir, item.name).replace(/\\/g, '/')
  nodes.push(item)
}

// 处理文件
async function handleFile(dir: string, item: ItemType, include: string[], nodes: ItemType[]): Promise<void> {
  const fullPath = path.join(dir, item.name)
  const suffix = path.extname(fullPath)
  if (include.includes(suffix)) {
    const obj = await getFile(fullPath)
    Object.assign(item, obj)
    item.suffix = suffix
    item.fullPath = fullPath.replace(/\\/g, '/')
    nodes.push(item)
  }
}

/**
 * @description:Generate node information for all files 生成所有文件的node信息
 * @param {*} dir   要解析的路径
 * @param {Array} nodes
 * @param {Number} level
 * @return {*}
 */
export async function getFileNodes(
  dir: string = process.cwd(),
  option?: OptionType,
  nodes: ItemType[] = [],
  level: number = 0
): Promise<ItemType[]> {
  let include = isDev ? ['.js', '.vue'] : ['.js', '.vue', '.ts', '.tsx']
  let finalIgnore: string[] = ignore
  if (option) {
    finalIgnore = option.ignore || ignore
    include = option.include || include
  }

  const files = await readdir(dir)
  const tempFiles = await Promise.all(files.map((item) => getFileInfo(dir, item, level)))
  sortFiles(tempFiles)

  for (const item of tempFiles) {
    if (!finalIgnore.includes(item.name)) {
      if (item.isDir) {
        await handleDirectory(dir, item, option, level, nodes)
      } else {
        await handleFile(dir, item, include, nodes)
      }
    }
  }
  logger.info('nodes: ', nodes)
  return nodes
}

/**
 * @description:Recursive file name + note  递归得到文件名+note
 * @param {Array} datas
 * @param {string} keys
 * @return {*}
 */
export function getNote(datas: ItemType[], keys?: string[]) {
  const nodes = keys || []
  datas.forEach((obj: ItemType, index: Number) => {
    const last = index === datas.length - 1
    if (obj.children) {
      //fold
      getNote(obj.children, nodes)
    }
    const md = setMd(obj, last)
    nodes.push(md)
  })
  return nodes
}

/**
 * @description:One obj generates one line of text  一个obj生成一个一行文字
 * @param {ItemType} obj
 * @param {Boolean} last  Is it the last one  是不是最后一个
 * @return {*}
 */
function setMd(obj: ItemType, last: Boolean): string {
  let filesString = ''
  const blank = '│ '.repeat(obj.level) // 重复空白
  const pre = `${blank}${last ? '└──' : '├──'} ${obj.name}`
  if (obj.isDir) {
    filesString += `${pre}\n`
  } else {
    filesString += `${pre}            ${obj.note}\n`
  }
  return filesString
}
