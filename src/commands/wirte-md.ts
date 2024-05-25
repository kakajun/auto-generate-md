/* 生成md说明文档 */
import fs from 'fs'
import path from 'path'
import { getFileNodes, getNote } from './get-file'
import type { ItemType } from '../types'
import { createConsola } from 'consola'

const logger = createConsola({
  level: 4
})
const rootPath = process.cwd().replace(/\\/g, '/')

type secoutType = { rowTotleNumber: number; sizeTotleNumber: number; coutObj: { [key: string]: number } }
/**
 * @description :Write the result to JS file
 * @param {data} data
 */
export function wirteMd(data: string, filePath: string): void {
  const file = path.resolve(rootPath, filePath)
  // 异步写入数据到文件
  fs.writeFile(file, data, { encoding: 'utf8' }, () => {
    logger.success('Write successful')
  })
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
  const note = getNote(nodes) // 得到所有note的数组
  const md = note.join('') + '\n' // 数组转字符串
  if (md.length > 0) {
    // logger.success('🀄️  生成MarkDown完毕 !')
  }
  return { md: md + coutMd, nodes }
}
