/* 获取文件相关方法 */
import fs from 'fs'
import path from 'path'
import createDebugger from 'debug'
import { changeImport } from './change-path'
import {getDependencies} from '../utils/router-utils';
import type { ItemType } from '../types'
const debug = createDebugger('get-file')
debug.enabled = false
const rootPath = process.cwd().replace(/\\/g, '/')
import { env } from 'node-environment'
const isDev = env() === 'development'
/**
 * @description:Gets the header comment of the file  获取文件的头部注释
 * @param {*} fullPath
 * @return {*}
 */
export async function getFile(fullPath: string) {
  const str = fs.readFileSync(fullPath, 'utf-8')
  const size = str.length
  const sarr = str.split(/[\n]/g)
  const rowSize = sarr.length
  const imports =await getImport(sarr, fullPath)
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
 * @author: majun
 * @param {any} sarr
 * @param {string} fullPath
 */
export async function  getImport(sarr: any[], fullPath: string) {
  const packageJsonPath = path.join(rootPath, 'package.json');
  let  dependencies=await getDependencies(packageJsonPath)
  // 这里获取每个文件的import路径
  const imports: string[] = []
  sarr.forEach((ele: string) => {
    if (ele.indexOf('from') > -1) {
      const obj=changeImport(ele, fullPath, dependencies)
      if (obj) {
        const { absoluteImport } =obj
        if (absoluteImport) {
          imports.push(absoluteImport)
        }
      }
    }
  })
  return imports
}

/**
 * @description:Generate node information for all files 生成所有文件的node信息
 * @param {*} dir   要解析的路径
 * @param {Array} nodes
 * @param {Number} level
 * @return {*}
 */
export  async function getFileNodes(
  dir: any = process.cwd(),
  option?: { ignore: string[] | undefined; include: string[] | undefined } | undefined,
  nodes: ItemType[] = [],
  level: number = 0
): Promise<ItemType[]> {
  //File filtering -- full name with suffix required  文件过滤--需要全称带后缀
  let ignore = [
    // 'api',
    // 'src',
    'bin',
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
  //File suffix contains only  文件后缀只包含
  let include = isDev ? ['.js', '.vue'] : ['.js', '.vue', '.ts', '.tsx']
  if (option) {
    ignore = option.ignore || ignore
    include = option.include || include
  }

  const files = fs
    .readdirSync(dir)
    .map((item) => {
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
    })
    //Sort folders and files, otherwise the generated will not correspond to the opening order of the editor 对文件夹和文件进行排序,要不然生成的和编辑器打开的顺序不对应
    .sort((a, b) => {
      if (!a.isDir && b.isDir) return 1
      if (a.isDir && !b.isDir) return -1
      if ((a.isDir && b.isDir) || (!a.isDir && !b.isDir)) return 0
      return 0
    })
  for (let index = 0; index < files.length; index += 1) {
    const item = files[index]
    //Folder filtering is handled here  这里处理文件夹过滤
    const foldFlag = ignore.findIndex((obj: string) => obj === item.name)
    if (foldFlag === -1) {
      const fullPath = path.join(dir, item.name)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      if (isDir) {
        //recursion 递归
      await  getFileNodes(fullPath, option, (item.children = []), level + 1)
        item.fullPath = fullPath.replace(/\\/g, '/')
        nodes.push(item)
      } else {
        const i = fullPath.lastIndexOf('.')
        const lastName = fullPath.substring(i)
        //File filtering is handled here 这里处理文件过滤
        if (include.includes(lastName)) {
          const obj =await getFile(fullPath)
          Object.assign(item, obj)
          item.suffix = lastName
          item.fullPath = fullPath.replace(/\\/g, '/')
          nodes.push(item)
        }
      }
    }
  }
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
