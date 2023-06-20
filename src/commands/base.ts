/* 界面命令注册在这里 */
import { ItemType } from './get-file'
import prompts from 'prompts'
import { wirteMd, getMd } from './wirte-md'
import { renameFoldPath, renameFilePath } from './rename-path'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'
import logger from '../shared/logger'
import { changePath, wirteJsNodes } from './change-path'
import { markFile, deletMarkAll, witeMarkFile } from './mark-file'
import { getRouterArrs } from './get-router'
import path from 'path'
import { VERSION, PKG_NAME } from '../shared/constant'
import fs from 'fs'
import help from '../../script/help/index'
// 为什么要加process.cwd()的replace 是为了抹平window和linux生成的路径不一样的问题
let rootPath = process.cwd().replace(/\\/g, '/')
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)

/**
 * @desc: //2.  得到md文档,------------>会写(只生成一个md)
 * @author: majun
 * @param {string} md
 */
function getMdAction(md: string) {
  console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${rootPath}/readme-md.md`)
  wirteMd(md, `${rootPath}/readme-md.md`)
}

/**
 * @desc: 这里做一个前置判断, 如果父路径不是src, 报错, 因为有changepath@符号是指向src的
 * @author: majun
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
 * @author: majun
 * @param {Array} nodes
 */
async function changePathAction(nodes: ItemType[]) {
  checkFold()
  await changePath(nodes)
}

/**
 * @desc: 修改绝对路径
 * @author: majun
 */
async function changeAbsolutePathAction() {}

async function changesuffixAction(nodes: ItemType[], nochangePath: Boolean) {
  checkFold()
  await changePath(nodes, nochangePath)
}

/**
 * @desc:   //4. 打标记 ------------> 会写(会操作代码)   //5. 分文件 ------------> 会写(会另外生成包文件)
 * @author: majun
 * @param {Array} nodes
 */
async function markFileAction(nodes: ItemType[]) {
  checkFold()
  const routers = getRouterArrs()
  fs.writeFileSync(rootPath + '/router-file.js', 'const router=' + JSON.stringify(routers), { encoding: 'utf8' })
  if (routers) {
    await markFile(nodes, routers)
    wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
  }
}

/**
 * @desc: 5,将打标记的进行copy
 * @author: majun
 * @param {Array} nodes
 */
async function witeFileAction(nodes: ItemType[]) {
  const routers = getRouterArrs()
  if (routers) {
    await markFile(nodes, routers)
    // copy文件一定是建立在打标记的基础上
    await witeMarkFile(nodes, routers)
  }
}
// /**
//  * @desc://6. 得到md对象(只生成一个md)
//  * @author: majun
//  * @param {Array} nodes
//  */
// async function wirteJsNodesAction(nodes: ItemType[]) {
//   // 要先改路径后缀,否则依赖收集不到
//   await changePathAction(nodes)
//   wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
// }

/**
 * @desc://7. 删除标记
 * @author: majun
 * @param {Array} nodes
 */
async function deletMarkAction(nodes: ItemType[]) {
  deletMarkAll(nodes, 'mark')
}

/**
 * @desc://8. 规范命名文件夹kabel-case
 * @author: majun
 * @param {Array} nodes
 */
async function renameFoldAction(nodes: ItemType[]) {
  renameFoldPath(nodes)
}

/**
 * @desc://9. 规范命名文件kabel-case
 * @author: majun
 * @param {Array} nodes
 */
async function renameFileAction(nodes: ItemType[]) {
  renameFilePath(nodes)
}

/**
 * @desc: 执行所有操作
 * @author: majun
 * @param {Array} nodes
 * @param {string} md
 */
export async function generateAllAction(nodes: ItemType[], md: string) {
  checkFold()
  const routers = getRouterArrs()
  if (routers) {
    getMdAction(md)
    await changePathAction(nodes)
    await markFileAction(nodes)
    // copy文件一定是建立在打标记的基础上
    await witeMarkFile(nodes, routers)
    wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
  }
}

/**
 * @desc: 所有命名都在这里注册,并调用执行
 * @author: majun
 */
function getActions() {
  const actionMap = new Map<string, prompts.Choice & { action: Function }>()
  //1. 这里只读文件, ------------>不写
  const { md, nodes } = getMd({ ignore, include })
  actionMap.set('help', {
    title: '帮助',
    value: 'help',
    selected: true,
    action: () => help()
  })
  actionMap.set('Generate All', {
    title: '生成全部',
    value: 'Generate All',
    selected: true,
    action: () => generateAllAction(nodes, md)
  })
  actionMap.set('Generate MD', {
    title: '生成结构树文档',
    value: 'Generate MD',
    selected: true,
    action: () => getMdAction(md)
  })
  actionMap.set('Change Relative Path', {
    title: '修改为相当路径',
    value: 'Change Relative Path',
    action: () => changePathAction(nodes)
  })
  actionMap.set('Change Absolute  Path', {
    title: '修改为绝对路径(暂未实现)',
    value: 'Change Absolute  Path',
    action: () => changeAbsolutePathAction()
  })
  actionMap.set('Completion suffix', {
    title: '补全后缀',
    value: 'Completion suffix',
    action: () => changesuffixAction(nodes, true)
  })

  actionMap.set('RenameFoldKebabCase', {
    title: '统一命名文件夹为KebabCase',
    value: 'RenameFoldKebabCase',
    action: () => renameFoldAction(nodes)
  })
  actionMap.set('RenameFielKebabCase', {
    title: '统一命名文件为KebabCase',
    value: 'RenameFielKebabCase',
    action: () => renameFileAction(nodes)
  })

  actionMap.set('Wirte Json Nodes', {
    title: '记录节点Json',
    value: 'Wirte Json Nodes',
    action: () => wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
  })

  actionMap.set('Mark File', {
    title: '标记文件',
    value: 'Mark File',
    action: () => markFileAction(nodes)
  })
  actionMap.set('Delete Mark', {
    title: '删除标记',
    value: 'Delete Mark',
    action: () => deletMarkAction(nodes)
  })
  actionMap.set('Classification', {
    title: '分类',
    value: 'Classification',
    action: () => witeFileAction(nodes)
  })
  // actionMap.set('Wirte  Nodes With Import(may change path)', {
  //   title: 'Wirte  Nodes With Import(may change path)',
  //   value: 'Wirte  Nodes With Import(may change path)',
  //   action: () => wirteJsNodesAction(nodes)
  // })
  return actionMap
}

export type BaseCmd = {
  init?: boolean
  config?: string
}

export default async function baseAction(cmd: BaseCmd) {
  if (cmd.init) {
    logger.info(`${PKG_NAME}:version is :${VERSION}`)
  }
  selectCommand()
}

/**
 * @desc: 选择命令
 * @author: majun
 */
async function selectCommand() {
  const actions = getActions()
  let result: any = {}
  try {
    result = await prompts(
      [
        {
          name: 'command',
          type: 'select',
          message: 'Please select a command.',
          choices: Array.from(actions.values())
        }
      ],
      {
        onCancel: () => {
          throw new Error('Operation cancelled.')
        }
      }
    )
  } catch (e: any) {
    logger.error(e.message)
    process.exit(1)
  }
  actions.get(result.command)!.action()
}
