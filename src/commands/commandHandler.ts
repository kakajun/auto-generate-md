// 命令处理逻辑
import prompts from 'prompts'
import {
  getMdAction,
  changePathAction,
  changeAbsolutePathAction,
  changesuffixAction,
  markFileAction,
  witeFileAction,
  deletMarkAction,
  renameFoldAction,
  renameFileAction,
  generateAllAction
} from './commandActions'
import { VERSION, PKG_NAME } from '../shared/constant'
import help from '../../script/help/index'
import stringToArgs from '../../script/cli'
import { wirteJsNodes } from './change-path'
import { getMd } from './wirte-md'
import handle from '../../script/cli/handle'

import logger from '../shared/logger'
// 为什么要加process.cwd()的replace 是为了抹平window和linux生成的路径不一样的问题
const rootPath = process.cwd().replace(/\\/g, '/')
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)

export async function selectCommand() {
  const actionMap = new Map<string, prompts.Choice & { action: Function }>()
  //1. 这里只读文件, ------------>不写
  const { md, nodes } =await getMd({ ignore, include })
  actionMap.set('help', {
    title: '🙏  帮助',
    value: 'help',
    selected: true,
    action: () => help()
  })
  actionMap.set('Generate All', {
    title: '🚘  执行所有操作',
    value: 'Generate All',
    selected: true,
    action: () => generateAllAction(nodes, md)
  })
  actionMap.set('Generate MD', {
    title: '📅  生成结构树文档',
    value: 'Generate MD',
    selected: true,
    action: () => getMdAction(md)
  })
  actionMap.set('Change Relative Path', {
    title: '🔑  修改为相当路径',
    value: 'Change Relative Path',
    action: () => changePathAction(nodes)
  })
  actionMap.set('Change Absolute  Path', {
    title: '💎  修改为绝对路径(暂未实现)',
    value: 'Change Absolute  Path',
    action: () => changeAbsolutePathAction()
  })
  actionMap.set('Completion suffix', {
    title: '💯  补全文件后缀',
    value: 'Completion suffix',
    action: () => changesuffixAction(nodes, true)
  })

  actionMap.set('RenameFoldKebabCase', {
    title: '🎁  统一命名文件夹为KebabCase',
    value: 'RenameFoldKebabCase',
    action: () => renameFoldAction(nodes)
  })
  actionMap.set('RenameFielKebabCase', {
    title: '🍰  统一命名文件为KebabCase',
    value: 'RenameFielKebabCase',
    action: () => renameFileAction(nodes)
  })

  actionMap.set('Wirte Json Nodes', {
    title: '🔱  记录节点Json',
    value: 'Wirte Json Nodes',
    action: () => wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
  })

  actionMap.set('Mark File', {
    title: '🎊  给需要分类的都打上标记',
    value: 'Mark File',
    action: () => markFileAction(nodes)
  })
  actionMap.set('Delete Mark', {
    title: '💥  删除标记',
    value: 'Delete Mark',
    action: () => deletMarkAction(nodes)
  })
  actionMap.set('Classification', {
    title: '💫  分类',
    value: 'Classification',
    action: () => witeFileAction(nodes)
  })
  return actionMap
}

export type BaseCmd = {
  init?: boolean
  config?: string
}
export async function handleCommand(cmd: BaseCmd) {
  if (cmd.init) {
    logger.info(`${PKG_NAME}:version is :${VERSION}`)
  }
  const actions = await selectCommand()
  let result: any = {}
  try {
    result = await prompts(
      [
        {
          name: 'command',
          type: 'select',
          message: '请使用上下键选择一个操作命令：',
          choices: Array.from(actions.values())
        }
      ],
      {
        onCancel: () => {
          throw new Error('操作取消！')
        }
      }
    )
  } catch (e: any) {
    logger.error(e.message)
    process.exit(1)
  }
  actions.get(result.command)!.action()
}
