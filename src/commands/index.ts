#!/usr/bin/env node
'use strict'
import path from 'path'
import { wirteMd, getMd } from './wirte-md'
import { changePath, wirteJsNodes } from './change-path'
import stringToArgs from '../script/cli'
import handle from '../script/cli/handle'
import markFile from './mark-file'

const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)
/**
 * @description:Automatic generation of the whole process  自动生成全流程, 注意顺序不能乱
 * @param {*}
 * @return {*}
 */
function agmd() {
  let rootPath = path.resolve('.\\unuse')
  //1. 这里只读文件, ------------>不写
  const { md, nodes } = getMd(rootPath, { ignore, include })
  //2.  得到md文档,------------>会写(只生成一个md)
  console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${rootPath}\\readme-md.md`)
  wirteMd(md, `${rootPath}\\readme-md.md`)
  //3. 更改所有为绝对路径+ 后缀补全------------>会写(会操作代码)
  changePath(nodes, rootPath)
  //4. 打标记 ------------> 会写(会操作代码)   //5. 分文件 ------------> 会写(会另外生成包文件)
  markFile(nodes, rootPath)

  //6. 得到md对象(只生成一个md)
  wirteJsNodes(JSON.stringify(nodes), rootPath + '\\readme-file.js')
}
agmd()
