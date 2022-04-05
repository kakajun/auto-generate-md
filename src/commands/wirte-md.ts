/**
 *================================================
 *@date:2022/04/04
 *@author:mj
 *@desc: 生成md说明文档
 *
 *================================================
 */
import fs from 'fs'
import path from 'path'
import { getFileNodes, getNote } from './get-file'
import { ItemType } from './get-file'
import createDebugger from 'debug'
const debug = createDebugger('wirte-md')
debug.enabled = true
type secoutType = { rowTotleNumber: number; sizeTotleNumber: number; coutObj: { [key: string]: number } }
/**
 * @description:Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
export function wirteMd(data: string, filePath: string) {
  const file = path.resolve(__dirname, filePath)
  // 异步写入数据到文件
  fs.writeFile(file, data, { encoding: 'utf8' }, () => {
    console.log('Write successful')
  })
}

/**
 * @description: Get statistics 得到统计
 * @param {Array} nodes
 * @return {*}
 */
function getCountMd(datas: Array<ItemType>) {
  let rowTotleNumber = 0
  let sizeTotleNumber = 0
  const coutObj: { [key: string]: number } = {}
  function getDeatle(nodes: Array<ItemType>) {
    nodes.forEach((obj: ItemType) => {
      if (obj.children) getDeatle(obj.children)
      else {
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
 * @param {num} To format a number 要格式化数字
 * @return {string}
 */
function format(num: number) {
  var reg = /\d{1,3}(?=(\d{3})+$)/g
  return (num + '').replace(reg, '$&,')
}

/**
 * @description: Generate statistics MD 生成统计md
 * @param {object} option
 * @return {*}
 */
function setCountMd(obj: secoutType) {
  const { rowTotleNumber, sizeTotleNumber, coutObj } = obj
  let countMd = ''
  let totle = 0
  for (const key in coutObj) {
    const ele = coutObj[key]
    totle += ele
    countMd += `The suffix is ${key} has ${ele} files\n`
  }
  countMd += `The totle  has ${totle} files\n`
  let md = `Total number of file lines: ${format(rowTotleNumber)},
Total number of codes: ${format(sizeTotleNumber)} \n`
  md = countMd + md
  return md
  // wirteMd(md, `${path.resolve('./')}\\count-md.md`)
}
/**
 * @description: Generate MD 生成md
 * @param {object} option
 * @return {*}
 */
export function getMd(
  rootPath: string,
  option?: { ignore: string[] | undefined; include: string[] | undefined } | undefined
) {
  console.log('\x1B[36m%s\x1B[0m', '*** run location: ', path.resolve('./') + '\n')
  const nodes = getFileNodes(rootPath, option)
  const countMdObj = getCountMd(nodes)
  const coutMd = setCountMd(countMdObj)
  console.log('\x1B[33m%s\x1b[0m', coutMd)
  const note = getNote(nodes) // 得到所有note的数组
  const md = note.join('') + '\n' // 数组转字符串
  if (md.length > 0) {
    console.log('\x1B[36m%s\x1B[0m', '*** Automatic generation completed ! ')
  }

  return { md: md + coutMd, nodes }
}
