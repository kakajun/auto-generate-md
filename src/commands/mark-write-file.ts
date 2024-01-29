import createDebugger from 'debug'
import { findNodes } from './mark-file'
import type { ItemType } from '../types'
import fs from 'fs-extra'
import { createConsola } from 'consola'
const logger = createConsola({
  level: 4 // 设置日志级别为 silent
})
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('mark-write-file')
debug.enabled = false

/**
 * 递归文件子依赖创建文件。文件外递归。
 * @param nodes - 节点列表
 * @param name - 文件名
 * @param path - 绝对路径
 */
export async function markWriteFile(nodes: ItemType[], name: string, path: string): Promise<void> {
  debug('入参: ', name, path)
  const node = findNodes(nodes, path)
  debug('查找的node: ', node)
  if (!node || node.copyed) return
  node.copyed = true
  if (node.belongTo.length > 0) {
    await setDispFileNew(path, name)
  }
  if (node.imports) {
    for (const element of node.imports) {
      if (await fs.pathExists(element)) {
        await markWriteFile(nodes, name, element)
      } else {
        logger.error(`${element} 文件不存在`)
      }
    }
  }
}

/**
 * 复制文件到指定位置。
 * @param pathN - 源文件路径
 * @param name - 目标文件夹名
 */
export async function setDispFileNew(pathN: string, name: string): Promise<void> {
  const relative = pathN.replace(rootPath, '')
  const writeFileName = `${rootPath}/${name}${relative}`
  try {
    if (await fs.pathExists(writeFileName)) return
    await fs.copy(pathN, writeFileName)
    debug('写入文件success! : ', writeFileName)
  } catch (err) {
    logger.error('文件写入失败')
  }
}
