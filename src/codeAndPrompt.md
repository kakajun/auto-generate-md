下面是整个工程的目录文件结构
├── commands
│ ├── agmd.ts            
│ ├── change-path.ts            
│ ├── command-actions.ts            /* 界面命令注册在这里 */
│ ├── command-handler.ts            // 命令处理逻辑
│ ├── get-file.ts            /* 获取文件相关方法 */
│ ├── get-router.ts            
│ ├── mark-file.ts            /* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
│ ├── mark-write-file.ts            
│ ├── rename-path.ts            /* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
│ └── wirte-md.ts            /* 生成md说明文档 */
├── shared
│ └── constant.ts            /* 解析package */
├── utils
│ └── router-utils.ts            
├── bin.ts            
├── index.ts            /* 这里抛出一些高级操作方法 */
└── types.ts            // 定义 Router 接口

😍 代码总数统计：
后缀是 .ts 的文件有 15 个
总共有 15 个文件
总代码行数有: 1,529行,
总代码字数有: 42,481个
path:/commands/agmd.ts
#!/usr/bin/env node
/* 搞个文件做bug测试,命令行不好调试 */
import { generateAllAction } from './command-actions'
import { getMd } from './wirte-md'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'

 async function main() {
  const options = stringToArgs(process.argv)
  const { ignores: ignore, includes: include } = handle(options)
  const { md, nodes } =await getMd({ ignore, include })
  await generateAllAction(nodes, md)
}

main()

path:/shared/constant.ts
/* 解析package */
import { name, version } from '../../package.json';

export const CWD = process.cwd();

export const VERSION = version;

export const PKG_NAME = name;

path:/bin.ts
#!/usr/bin/env node
import { Command } from 'commander'
import { handleCommand } from './commands/command-handler'
const program = new Command()
program.action(handleCommand)
program.parse(process.argv)

path:/utils/router-utils.ts

import { access, readFile } from 'fs/promises';
/**
 * 解析路由文件中的路由路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string} - 解析出的路由路径。
 */
export function parseRouterPath(line: string): string {
  const pathRegex = /path:\s*['"]([^'"]+)['"]/
  const match = line.match(pathRegex)
  return match ? match[1] : ''
}

/**
 * 解析路由文件中的组件路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string | ''} - 解析出的组件路径或null。
 */
export function parseComponentPath(line: string): string {
  const componentRegex = /component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/
  const match = line.match(componentRegex)
  return match ? match[1] : ''
}

export async function getDependencies(packageJsonPath: string): Promise<string[]> {
  let dependencies: string[] = [];
  if (packageJsonPath) {
    try {
      await access(packageJsonPath);
      const pkg = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
      dependencies = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
    } catch (error) {
      console.error(error);
    }
  }
  return dependencies;
}

path:/commands/change-path.ts
import fs from 'fs'
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { createConsola } from 'consola'
import { getDependencies } from '../utils/router-utils'
import type { ItemType } from '../types'
const logger = createConsola({
  level: 4
})

const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * 检查当前目录是否为项目根目录。
 * 根据是否存在 package.json 文件来判断。
 */
function isRootDirectory(): boolean {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  try {
    fs.accessSync(packageJsonPath, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

/**
 * @desc: 递归循环所有文件

 * @param {Array} nodes      整个文件的nodes
 */
export async function changePath(nodes: ItemType[], nochangePath?: Boolean) {
  async function getNode(objs: ItemType[]) {
    for (const ele of objs) {
      if (ele.children) {
        await getNode(ele.children)
      } else {
        if (isRootDirectory()) {
          await writeToFile(ele, true, nochangePath)
        }
      }
    }
  }
  await getNode(nodes)
}

/**
 * @desc: 这里返回没有@ 符号的路径
 * @param {string} absoluteImport  依赖本身名字
 * @param {string} fullPath  文件本身绝对地址
 */
export function getRelatPath(absoluteImport: string, fullPath: string) {
  let relatPath = path.relative(path.dirname(fullPath), absoluteImport).replace(/\\/g, '/')
  if (!relatPath.startsWith('.')) {
    relatPath = './' + relatPath
  }
  return relatPath
}

/**
 * @desc: 补后缀的方法+替换前缀
 * @param {string} filePath  正则匹配到的依赖路径
 * @param {string} fullPath  本身文件名路径
 * @param {string} impName   正确的名字
 */
export function makeSuffix(filePath: string, fullPath: string) {
  let absoluteImport = filePath.includes('@')
    ? filePath.replace('@', process.cwd())
    : path.resolve(path.dirname(fullPath), filePath)

  const lastName = path.extname(absoluteImport)

  if (!lastName) {
    const suffixes = ['.ts', '.vue', '.tsx', '.js', '/index.js', '/index.vue']
    for (const suffix of suffixes) {
      if (fs.existsSync(absoluteImport + suffix)) {
        absoluteImport += suffix
        // logger.info('补充后缀:', absoluteImport + suffix)
        break
      }
    }
  }
  return absoluteImport.replace(/\\/g, '/')
}

/**
 * @desc: 根据一行代码匹配import的详细内容  TODO 这里还得优化

 */
export function getImportName(ele: string, dependencies: string[]) {
  let str = ''
  const flag = dependencies.some((item) => ele.indexOf(item) > -1)
  const reg = / from [\"|\'](.*)[\'|\"]/
  // 这里只收集组件依赖, 插件依赖排除掉
  if (!flag && ele.indexOf('/') > -1 && ele.indexOf('//') !== 0) {
    const impStr = ele.match(reg)
    // 没有import的不转
    if (impStr && impStr[1]) str = impStr[1]
  }
  return str
}

/**
 * @desc: 找到import并返回全路径和原始路径
 * @param {string} ele    找到的行引入
 * @param {string} fullPath  文件的全路径
 */
export function changeImport(ele: string, fullPath: string, dependencies: string[], nochangePath?: Boolean) {
  const impName = getImportName(ele, dependencies)
  if (!impName) return null

  const absoluteImport = makeSuffix(impName, fullPath)
  const obj = {
    impName: nochangePath ? impName : getRelatPath(absoluteImport, fullPath),
    filePath: impName,
    absoluteImport
  }
  return obj
}

/**
 * @desc:  写文件
 * @param {string} file  目标地址
 */
export async function writeToFile(node: ItemType, isRelative?: Boolean, nochangePath?: Boolean) {
  const { fullPath } = node
  const packageJsonPath = path.join(rootPath, 'package.json')
  const dependencies = await getDependencies(packageJsonPath)

  try {
    const fileStr = await readFile(fullPath, 'utf-8')
    const lines = fileStr.split(/[\n]/g)

    // 使用 map() 来处理每一行
    const updatedLines = lines.map((line) => {
      if (line.includes('from') && isRelative) {
        const obj = changeImport(line, fullPath, dependencies, nochangePath)
        if (obj && obj.impName) {
          // 使用模板字符串来增加可读性
          logger.info(`Updating import in node: ${node}`)
          return line.replace(obj.filePath, obj.impName)
        }
      }
      return line
    })

    // 检查是否有任何变化
    if (updatedLines.join('\n') !== fileStr) {
      await writeFile(fullPath, updatedLines.join('\n'), 'utf-8')
      logger.success(`Write file successful: ${fullPath}`)
    }
  } catch (error) {
    // 提供更详细的错误信息
    logger.error(`Error reading file: ${fullPath}, Error: ${error}`)
  }
}
/**
 * @description: Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
export async function wirteJsNodes(data: string, filePath: string): Promise<void> {
  const file = path.resolve(rootPath, filePath)
  const content = `export default ${data}`
  await writeFile(file, content, { encoding: 'utf8' })
  logger.success(`Write file successful: ${filePath}`)
}

path:/index.ts
/* 这里抛出一些高级操作方法 */
import { getMd } from './commands/wirte-md'
import { getFileNodes } from './commands/get-file'
export { getMd, getFileNodes }

path:/commands/command-actions.ts
/* 界面命令注册在这里 */
import type { ItemType } from '../types'
import { wirteMd } from './wirte-md'
import { writeFile } from 'fs/promises'
import { renameFoldPath, renameFilePath, renameCamelCaseFilePath } from './rename-path'
import { createConsola } from 'consola'
import { changePath, wirteJsNodes } from './change-path'
import { markFile, deletMarkAll, witeMarkFile } from './mark-file'
import { getRouterArrs } from './get-router'
import path from 'path'

const logger = createConsola({
  level: 4
})
// 为什么要加process.cwd()的replace 是为了抹平window和linux生成的路径不一样的问题
const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * @desc: //2.  得到md文档,------------>会写(只生成一个md)
 * @param {string} md
 */
export function getMdAction(md: string) {
  console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${rootPath}/readme-md.md`)
  wirteMd(md, `${rootPath}/readme-md.md`)
}

/**
 * @desc: 这里做一个前置判断, 如果父路径不是src, 报错, 因为有changepath@符号是指向src的
 */
function checkFold() {
  const foldPath = path.resolve('./').replace(/\\/g, '/')
  const foldArrs = foldPath.split('/')
  const foldName = foldArrs.pop()
  if (foldName === 'pages') {
    return
  }
  if (foldName !== 'src') {
    logger.error('changePath需要在src目录下运行命令! ')
    process.exit(1)
  }
}

/**
 * @desc:   //3. 更改所有为绝对路径+ 后缀补全------------>会写(会操作代码)
 * @param {Array} nodes
 */
export async function changePathAction(nodes: ItemType[]) {
  checkFold()
  await changePath(nodes)
}

/**
 * @desc: 修改绝对路径
 */
export async function changeAbsolutePathAction() {}

export async function changesuffixAction(nodes: ItemType[], nochangePath: Boolean) {
  checkFold()
  await changePath(nodes, nochangePath)
}

/**
 * @desc:   //4. 打标记 ------------> 会写(会操作代码)   //5. 分文件 ------------> 会写(会另外生成包文件)

 * @param {Array} nodes
 */
export async function markFileAction(nodes: ItemType[]) {
  checkFold()
  const routers = await getRouterArrs()
  await writeFile(rootPath + '/router-file.js', 'const router=' + JSON.stringify(routers), { encoding: 'utf8' })
  if (routers) {
    await markFile(nodes, routers)
    await wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
  }
}

/**
 * @desc: 5,将打标记的进行copy
 * @param {Array} nodes
 */
export async function witeFileAction(nodes: ItemType[]) {
  const routers = await getRouterArrs()
  if (routers) {
    await markFile(nodes, routers)
    // copy文件一定是建立在打标记的基础上
    await witeMarkFile(nodes, routers)
  }
}
// /**
//  * @desc://6. 得到md对象(只生成一个md)
//  * @param {Array} nodes
//  */
// async function wirteJsNodesAction(nodes: ItemType[]) {
//   // 要先改路径后缀,否则依赖收集不到
//   await changePathAction(nodes)
//   wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
// }

/**
 * @desc://7. 删除标记

 * @param {Array} nodes
 */
export async function deletMarkAction(nodes: ItemType[]) {
  await deletMarkAll(nodes, 'mark')
}

/**
 * @desc://8. 规范命名文件夹kabel-case
 * @param {Array} nodes
 */
export async function renameKebFoldAction(nodes: ItemType[]) {
  renameFoldPath(nodes)
}

/**
 * @desc://9. 规范命名文件kabel-case
 * @param {Array} nodes
 */
export async function renameFileAction(nodes: ItemType[]) {
  renameFilePath(nodes)
}

/**
 * @desc://10. 规范命名文件夹Upercamecase
 * @param {Array} nodes
 */
export async function renameCamFoldAction(nodes: ItemType[]) {
  renameFoldPath(nodes, true)
}

export async function renameUpperCamelCaseAction(nodes: ItemType[]) {
  renameCamelCaseFilePath(nodes)
}

/**
 * @desc: 执行所有操作
 * @param {Array} nodes
 * @param {string} md
 */
export async function generateAllAction(nodes: ItemType[], md: string) {
  checkFold()
  const routers = await getRouterArrs()
  if (routers) {
    getMdAction(md)
    await changePathAction(nodes)
    await markFileAction(nodes)
    // copy文件一定是建立在打标记的基础上
    await witeMarkFile(nodes, routers)
    await wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
  }
}

path:/types.ts
// 定义 Router 接口
export interface Router {
  path: string
  component: string
}

export interface RouterItem {
  name: string
  router: Router[]
}

export interface OptionType {
  ignore?: string[]
  include?: string[]
}

export type ItemType = {
  name: string
  copyed?: boolean
  isDir: boolean
  level: number
  note: string
  size?: number
  suffix?: string
  rowSize?: number
  fullPath: string
  belongTo: string[] // 标记归属设置 分类用
  imports: string[] // 依赖收集
  children?: ItemType[]
}

