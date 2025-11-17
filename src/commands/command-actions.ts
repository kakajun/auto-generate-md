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
  level: process.env.AGMD_SILENT === '1' ? 0 : 4
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
export async function changeAbsolutePathActionRun(nodes: ItemType[]) {
  await changePath(nodes)
  // 第二次写入，将相对路径改为使用 @ 别名的绝对路径
  await changePath(nodes, false, true)
}

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
