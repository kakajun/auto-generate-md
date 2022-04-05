/**
*================================================
*@date:2022/04/05
*@author:mj
*@desc: 界面命令注册在这里
*
*================================================
*/
import { ItemType } from './get-file'
import prompts from 'prompts'
import path from 'path'
import { wirteMd, getMd } from './wirte-md'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'
import logger from '../shared/logger'
import { changePath, wirteJsNodes } from './change-path'
import markFile from './mark-file'
import fs from 'fs-extra'
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)
/**
 * @desc: //2.  得到md文档,------------>会写(只生成一个md)
 * @author: majun
 * @param {string} md
 * @param {string} rootPath
 */
function getMdAction(md: string, rootPath: string) {
  console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${rootPath}\\readme-md.md`)
  wirteMd(md, `${rootPath}\\readme-md.md`)
}

/**
 * @desc:   //3. 更改所有为绝对路径+ 后缀补全------------>会写(会操作代码)
 * @author: majun
 * @param {Array} nodes
 * @param {string} rootPath
 */
function changePathAction(nodes: Array<ItemType>, rootPath: string) {
  changePath(nodes, rootPath)
}

/**
 * @desc:   //4. 打标记 ------------> 会写(会操作代码)   //5. 分文件 ------------> 会写(会另外生成包文件)
 * @author: majun
 * @param {Array} nodes
 * @param {string} rootPath
 */
function markFileAction(nodes: Array<ItemType>, rootPath: string) {
   let path = rootPath + '/classify.js'
  if (!fs.existsSync(path)) {
    const routers = fs.readFileSync(path, 'utf-8')
    markFile(nodes, rootPath, routers)
  } else {
    process.exit(1)
  }

}

/**
 * @desc: //6. 得到md对象(只生成一个md)
 * @author: majun
 * @param {type} params
 */
function wirteJsNodesAction(nodes: Array<ItemType>, rootPath: string) {
  wirteJsNodes(JSON.stringify(nodes), rootPath + '\\readme-file.js')
}

function generateAllAction(nodes: Array<ItemType>, rootPath: string, md: string) {
  getMdAction(md, rootPath)
  getMdAction(md, rootPath)
  changePathAction(nodes, rootPath)
  markFileAction(nodes, rootPath)
  wirteJsNodesAction(nodes, rootPath)
}

/**
 * @desc: 所有命名都在这里注册,并调用执行
 * @author: majun
 */
function getActions() {
  const actionMap = new Map<string, prompts.Choice & { action: Function }>()
  let rootPath = path.resolve('.\\unuse')
  //1. 这里只读文件, ------------>不写
  const { md, nodes } = getMd(rootPath, { ignore, include })

  actionMap.set('Generate All', {
    title: 'Generate All',
    value: 'Generate All',
    selected: true,
    action: () => generateAllAction(nodes, rootPath, md)
  })
  actionMap.set('Generate MD', {
    title: 'Generate MD',
    value: 'Generate MD',
    selected: true,
    action: () => getMdAction(md, rootPath)
  })
  actionMap.set('Change Path', {
    title: 'Change Path',
    value: 'Change Path',
    action: () => changePathAction(nodes, rootPath)
  })
  actionMap.set('Mark File', {
    title: 'Mark File',
    value: 'Mark File',
    action: () => markFileAction(nodes, rootPath)
  })
  actionMap.set('Wirte Json Nodes', {
    title: 'Wirte Json Nodes',
    value: 'Wirte Json Nodes',
    action: () => wirteJsNodesAction(nodes, rootPath)
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
