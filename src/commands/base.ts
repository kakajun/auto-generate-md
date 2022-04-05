// import { existsSync, statSync } from 'fs-extra';
// import { dirname, extname, isAbsolute, resolve } from 'path';
import prompts from 'prompts';
import path from 'path'
import {
  wirteMd,
  getMd
} from './wirte-md'
// import { changePath, wirteJsNodes } from './change-path'
import stringToArgs from '../../script/cli'
import handle from '../../script/cli/handle'
// import markFile from './mark-file'
const options = stringToArgs(process.argv)
const { ignores: ignore, includes: include } = handle(options)
import logger from '../shared/logger';

// import buildAction from './build';
function getMdAction() {
    let rootPath = path.resolve('.\\unuse')
    //1. 这里只读文件, ------------>不写
  const { md, nodes } = getMd(rootPath, { ignore, include })
  console.log(nodes)
    //2.  得到md文档,------------>会写(只生成一个md)
    console.log('\x1B[36m%s\x1B[0m', '*** location: ', `${rootPath}\\readme-md.md`)
    wirteMd(md, `${rootPath}\\readme-md.md`)
}

function getActions() {
  const actionMap = new Map<string, prompts.Choice & { action: Function }>();
  actionMap.set('create', {
    title: 'create',
    value: 'create',
    selected: true,
    action: getMdAction
  })
  // actionMap.set('build', { title: 'build', value: 'build', action: buildAction });

  return actionMap;
}

export type BaseCmd = {
  init?: boolean;
  config?: string;
};

export default async function baseAction(cmd: BaseCmd) {
  if (cmd.init) {
    // return generateConfig();
  }
  selectCommand();
}



async function selectCommand() {
  const actions = getActions();
  let result: any = {};

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
    );
  } catch (e: any) {
    logger.error(e.message);
    process.exit(1);
  }

  actions.get(result.command)!.action();
}
