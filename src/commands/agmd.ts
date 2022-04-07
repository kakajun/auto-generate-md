#!/usr/bin/env node
/* 搞个文件做bug测试,命令行不好调试 */

import { generateAllAction } from './base'
import { getMd } from './wirte-md'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'
// import path from 'path';
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)
//1. 这里只读文件, ---------->不写
const { md, nodes } = getMd({ ignore, include })
// console.log(path.resolve('./'),"hhhhhhhhh")
generateAllAction(nodes, md)
