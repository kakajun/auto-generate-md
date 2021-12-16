#!/usr/bin/env node
// 获取文件的头部注释工具
import path from 'path'
import fs from 'fs'
import { getMd } from './index'

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.resolve()
/**
 * @description: 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
// function wirteJs(data: string, filePath: string) {
//   const file = path.resolve(__dirname, filePath)
//   const pre = 'export default'
//   // 异步写入数据到文件
//   fs.writeFile(file, pre + data, { encoding: 'utf8' }, (err) => {
//     console.error(err);
//   })
// }

/**
 * @description: 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
function wirteMd(data: string, filePath: string) {
  const file = path.resolve(__dirname, filePath)
  const pre = '```js\n'
  const last = '```\n'
  // 异步写入数据到文件
  fs.writeFile(file, pre + data + last, { encoding: 'utf8' }, (err) => { console.error(err);})
}

/**
 * @description: 自动生成全流程
 * @param {*}
 * @return {*}
 */
function agmd() {
  const md = getMd()
  // 得到md对象
  // wirteJs(JSON.stringify(nodes), __dirname + "\\readme-file.js");
  // 得到md文档
  console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${path.resolve('./')}\\readme-md.md`)
  wirteMd(md, `${path.resolve('./')}\\readme-md.md`)
}
agmd()
