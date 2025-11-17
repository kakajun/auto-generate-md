/* 生成md说明文档 */

import path from 'path'
import { getFileNodes, getNote } from './get-file'
import type { ItemType } from '../types'
import { createConsola } from 'consola'
import { readFile, writeFile as nodeWriteFile } from 'fs/promises'
const logger = createConsola({
  level: process.env.AGMD_SILENT === '1' ? 0 : 4
})
const rootPath = process.cwd().replace(/\\/g, '/')

type secoutType = { rowTotleNumber: number; sizeTotleNumber: number; coutObj: { [key: string]: number } }
/**
 * @description :Write the result to JS file
 * @param {data} data
 */
export async function wirteMd(data: string, filePath: string): Promise<void> {
  const file = path.resolve(rootPath, filePath)
  // 异步写入数据到文件
  if (process.env.AGMD_DRY_RUN === '1') {
    logger.info(`Dry-run: would write file ${file}`)
  } else {
    await nodeWriteFile(file, data, { encoding: 'utf8' })
    logger.success('Write successful')
  }
}

/**
 * @description: Get statistics
 * @param {Array} datas
 * @return {Object}
 */
export function getCountMd(datas: ItemType[]): secoutType {
  let rowTotleNumber = 0
  let sizeTotleNumber = 0
  const coutObj: { [key: string]: number } = {}
  function getDeatle(nodes: ItemType[]) {
    nodes.forEach((obj: ItemType) => {
      if (obj.children) getDeatle(obj.children)
      else if (obj.suffix && obj.rowSize && obj.size) {
        if (!coutObj.hasOwnProperty(obj.suffix)) coutObj[obj.suffix] = 0
        coutObj[obj.suffix]++
        rowTotleNumber += obj.rowSize
        sizeTotleNumber += obj.size
      }
    })
  }
  getDeatle(datas)
  return {
    rowTotleNumber,
    sizeTotleNumber,
    coutObj
  }
}

/**
 * @description:Thousands format 千分位格式化
 * @param {num} num format a number 要格式化数字
 * @return {string}
 */
function format(num: number): string {
  var reg = /\d{1,3}(?=(\d{3})+$)/g
  return (num + '').replace(reg, '$&,')
}

/**
 * @description: Generate statistics MD 生成统计md
 * @param {object} obj
 * @return {string}
 */
export function setCountMd(obj: secoutType): string {
  const { rowTotleNumber, sizeTotleNumber, coutObj } = obj
  let countMd = '😍 代码总数统计：\n'
  let totle = 0
  for (const key in coutObj) {
    const ele = coutObj[key]
    totle += ele
    countMd += `后缀是 ${key} 的文件有 ${ele} 个\n`
  }
  countMd += `总共有 ${totle} 个文件\n`
  let md = `总代码行数有: ${format(rowTotleNumber)}行,
总代码字数有: ${format(sizeTotleNumber)}个\n`
  md = countMd + md
  return md
}
/**
 * @description: Generate MD 生成md
 * @param {object} option
 */
export async function getMd(option?: { ignore?: string[]; include?: string[] }) {
  logger.success('👉  命令运行位置: ' + process.cwd() + '\n')
  const nodes = await getFileNodes(rootPath, option)
  const countMdObj = getCountMd(nodes)
  const coutMd = setCountMd(countMdObj)
  logger.success(coutMd)
  const note = getNote(nodes)
  const md = note.join('') + '\n'
  const composed = `# 目录结构\n${md}\n## 统计\n${coutMd}`
  return { md: composed, nodes }
}

/**
 * @description: 获取代码及结构作为提示
 * @param {string} data
 * @param {ItemType} nodes
 */
export async function witeCodeAndPrompt(inRootPath: string, data: string, nodes: ItemType[]): Promise<void> {
  const menuSt = '下面是整个工程的目录文件结构\n' + data
  let content = '下面是整个代码内容,其中path:是文件路径,其他是文件内容\n'
  async function find(objs: ItemType[]) {
    for (let index = 0; index < objs.length; index++) {
      const element = objs[index]
      if (element.children) find(element.children)
      else {
        // 文件,读取内容
        const fileStr = await readFile(element.fullPath, 'utf-8')
        const file = 'path:' + element.fullPath.replace(inRootPath, '') + '\n' + fileStr + '\n'
        content = content + file
      }
    }
  }
  try {
    await find(nodes)
  } catch (error) {
    console.error(error)
  }
  const out = `${inRootPath}/codeAndPrompt.md`
  if (process.env.AGMD_DRY_RUN === '1') {
    logger.info(`Dry-run: would write file ${out}`)
  } else {
    await nodeWriteFile(out, menuSt + content, { encoding: 'utf8' })
    logger.success('🀄️  生成codeAndPrompt.md完毕 !')
  }
}
