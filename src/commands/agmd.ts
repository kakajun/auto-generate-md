#!/usr/bin/env node
/* 搞个文件做bug测试,命令行不好调试 */
import { generateAllAction } from './commandActions'
import { getMd } from './wirte-md'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)
const { md, nodes } = getMd({ ignore, include })
generateAllAction(nodes, md)
