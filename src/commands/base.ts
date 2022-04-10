/* 界面命令注册在这里 */
import { ItemType } from './get-file'
import prompts from 'prompts'
import { wirteMd, getMd } from './wirte-md'
import { renameKebabCase } from './rename-kebab-case'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'
import logger from '../shared/logger'
import { changePath, wirteJsNodes } from './change-path'
import { markFile, deletMarkAll, witeFile } from './mark-file'
import fs from 'fs-extra'
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)
/**
 * @desc: //2.  得到md文档,------------>会写(只生成一个md)
 * @author: majun
 * @param {string} md
 */
function getMdAction(md: string) {
  console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${process.cwd()}\\readme-md.md`)
  wirteMd(md, `${process.cwd()}\\readme-md.md`)
}

/**
 * @desc:   //3. 更改所有为绝对路径+ 后缀补全------------>会写(会操作代码)
 * @author: majun
 * @param {Array} nodes
 */
async function changePathAction(nodes: ItemType[]) {
 await changePath(nodes)
}

/**
 * @desc:   //4. 打标记 ------------> 会写(会操作代码)   //5. 分文件 ------------> 会写(会另外生成包文件)
 * @author: majun
 * @param {Array} nodes
 */
async  function markFileAction(nodes: ItemType[]) {
  let pathName = process.cwd() + '/classify.js'
  if (fs.existsSync(pathName)) {
    const routers = require(pathName)
   await  markFile(nodes, routers)
    wirteJsNodes(JSON.stringify(nodes), process.cwd() + '\\readme-file.js')
  } else {
    console.error('跟路径没发现有classify.js, 现在退出')
    process.exit(1)
  }
}

/**
 * @desc: 5,将打标记的进行copy
 * @author: majun
 * @param {Array} nodes
 */
async function witeFileAction(nodes: ItemType[]) {
  let pathName = process.cwd() + '/classify.js'
  if (fs.existsSync(pathName)) {
    const routers = require(pathName)
    await markFile(nodes, routers)
    // copy文件一定是建立在打标记的基础上
    witeFile(nodes, routers)
  } else {
    console.error('跟路径没发现有classify.js, 现在退出')
    process.exit(1)
  }
}
/**
 * @desc://6. 得到md对象(只生成一个md)
 * @author: majun
 * @param {Array} nodes
 */
async function wirteJsNodesAction(nodes: ItemType[]) {
  // 要先改路径后缀,否则依赖收集不到
await  changePathAction(nodes)
  wirteJsNodes(JSON.stringify(nodes), process.cwd() + '\\readme-file.js')
}

/**
 * @desc://7. 删除标记
 * @author: majun
 * @param {Array} nodes
 */
async function deletMarkAction(nodes: ItemType[]) {
  deletMarkAll(nodes,'base')
}


/**
 * @desc://8. 规范命名kabel-case
 * @author: majun
 * @param {Array} nodes
 */
async function renameAction() {
  renameKebabCase(process.cwd())
}

/**
 * @desc: 执行所有操作
 * @author: majun
 * @param {Array} nodes
 * @param {string} md
 */
export async function generateAllAction(nodes: ItemType[], md: string) {
    let pathName = process.cwd() + '/classify.js'
    const routers = require(pathName)
  getMdAction(md)
  await changePathAction(nodes)
  await markFileAction(nodes)
  // copy文件一定是建立在打标记的基础上
  witeFile(nodes, routers)
  wirteJsNodes(JSON.stringify(nodes), process.cwd() + '\\readme-file.js')
}

/**
 * @desc: 所有命名都在这里注册,并调用执行
 * @author: majun
 */
function getActions() {
  const actionMap = new Map<string, prompts.Choice & { action: Function }>()
  //1. 这里只读文件, ------------>不写
  const { md, nodes } = getMd({ ignore, include })

  actionMap.set('Generate All', {
    title: 'Generate All',
    value: 'Generate All',
    selected: true,
    action: () => generateAllAction(nodes, md)
  })
  actionMap.set('Generate MD', {
    title: 'Generate MD',
    value: 'Generate MD',
    selected: true,
    action: () => getMdAction(md)
  })
  actionMap.set('Change Path', {
    title: 'Change Path',
    value: 'Change Path',
    action: () => changePathAction(nodes)
  })
  actionMap.set('Mark File', {
    title: 'Mark File',
    value: 'Mark File',
    action: () => markFileAction(nodes)
  })
  actionMap.set('Delete Mark', {
    title: 'Delete Mark',
    value: 'Delete Mark',
    action: () => deletMarkAction(nodes)
  })
  actionMap.set('Classification', {
    title: 'Classification',
    value: 'Classification',
    action: () => witeFileAction(nodes)
  })
  actionMap.set('RenameKebabCase', {
    title: 'RenameKebabCase',
    value: 'RenameKebabCase',
    action: () => renameAction()
  })


  actionMap.set('Wirte Json Nodes', {
    title: 'Wirte Json Nodes',
    value: 'Wirte Json Nodes',
    action: () => wirteJsNodes(JSON.stringify(nodes), process.cwd() + '\\readme-file.js')
  })
  actionMap.set('Wirte  Nodes With Import(may change path)', {
    title: 'Wirte  Nodes With Import(may change path)',
    value: 'Wirte  Nodes With Import(may change path)',
    action: () => wirteJsNodesAction(nodes)
  })
  return actionMap
}

export type BaseCmd = {
  init?: boolean
  config?: string
}

export default async function baseAction(cmd: BaseCmd) {
  if (cmd.init) {
    // return generateConfig();
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
