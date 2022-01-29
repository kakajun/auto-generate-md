// 获取文件的头部注释工具
// ts-node agmd.ts --ignore lib,node_modules,dist --include .js,.ts,.vue
import path from 'path'
import fs from 'fs'
import { getMd } from './index'
import stringToArgs from '../script/cli'
import handle from '../script/cli/handle'
// console.log(process.argv)
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)

// console.log(, '6666')
var __dirname = path.resolve()
/**
 * @description: 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
function wirteMd(data: string, filePath: string) {
  const file = path.resolve(__dirname, filePath)
  // 异步写入数据到文件
  fs.writeFile(file, data, { encoding: 'utf8' }, (err) => {
    console.error(err)
  })
}

/**
 * @description: 自动生成全流程
 * @param {*}
 * @return {*}
 */
function agmd() {
  const md = getMd({ ignore, include })
  // 得到md文档
  console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${path.resolve('./')}\\readme-md.md`)
  wirteMd(md, `${path.resolve('./')}\\readme-md.md`)
}
agmd()
