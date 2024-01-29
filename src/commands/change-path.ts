import fs from 'fs'
import path from 'path'
import { createConsola } from 'consola'
import { getDependencies } from '../utils/router-utils';
import type { ItemType } from '../types'
const logger = createConsola({
  level: 4 // 设置日志级别为 silent
})

const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * @desc: 递归循环所有文件

 * @param {Array} nodes      整个文件的nodes
 */
export async function changePath(nodes: ItemType[], nochangePath?: Boolean) {
  async function getNode(objs: ItemType[]) {
    for (const ele of objs) {
      if (ele.children) {
        await getNode(ele.children)
      } else {
        await witeFile(ele, true, nochangePath)
      }
    }
  }
  await getNode(nodes)
}

/**
 * @desc: 这里返回没有@ 符号的路径
 * @param {string} absoluteImport  依赖本身名字
 * @param {string} fullPath  文件本身绝对地址
 */
export function getRelatPath(absoluteImport: string, fullPath: string) {
  let relatPath = path.relative(path.dirname(fullPath), absoluteImport).replace(/\\/g, '/')
  if (!relatPath.startsWith('.')) {
    relatPath = './' + relatPath
  }
  return relatPath
}

/**
 * @desc: 补后缀的方法+替换前缀

 * @param {string} filePath  正则匹配到的依赖路径
 * @param {string} fullPath  本身文件名路径
 * @param {string} impName   正确的名字
 */
export function makeSuffix(filePath: string, fullPath: string) {
  let absoluteImport = filePath.includes('@')
    ? filePath.replace('@', process.cwd())
    : path.resolve(path.dirname(fullPath), filePath)

  logger.info('makeSuffix 入参: absoluteImport', absoluteImport)
  const lastName = path.extname(absoluteImport)

  if (!lastName) {
    const suffixes = ['.js', '.ts', '.vue', '.tsx', '/index.js', '/index.vue']
    for (const suffix of suffixes) {
      if (fs.existsSync(absoluteImport + suffix)) {
        absoluteImport += suffix
        break
      }
    }
  }
  return absoluteImport.replace(/\\/g, '/')
}

/**
 * @desc: 根据一行代码匹配import的详细内容  TODO 这里还得优化

 */
export function getImportName(ele: string, dependencies: string[]) {
  let str = ''
  const flag = dependencies.some((item) => ele.indexOf(item) > -1)
  const reg = / from [\"|\'](.*)[\'|\"]/
  // 这里只收集组件依赖, 插件依赖排除掉
  if (!flag && ele.indexOf('/') > -1 && ele.indexOf('//') !== 0) {
    const impStr = ele.match(reg)
    // 没有import的不转
    if (impStr && impStr[1]) str = impStr[1]
  }
  return str
}

/**
 * @desc: 找到import并返回全路径和原始路径
 * @param {string} ele    找到的行引入
 * @param {string} fullPath  文件的全路径
 */
export function changeImport(ele: string, fullPath: string, dependencies: string[], nochangePath?: Boolean) {
  const impName = getImportName(ele, dependencies)
  if (!impName) return null

  const absoluteImport = makeSuffix(impName, fullPath)
  const obj = {
    impName: nochangePath ? impName : getRelatPath(absoluteImport, fullPath),
    filePath: impName,
    absoluteImport
  }
  return obj
}

/**
   * @desc:  写文件
   * @param {string} file  目标地址
   */
export async function witeFile(node: ItemType, isRelative?: Boolean, nochangePath?: Boolean) {
  const { fullPath } = node
  const packageJsonPath = path.join(rootPath, 'package.json');
  let dependencies = await getDependencies(packageJsonPath)
  try {
    let writeFlag = false // 如果啥都没改, 不更新文件
    let fileStr = fs.readFileSync(fullPath, 'utf-8')
    const sarr = fileStr.split(/[\n]/g)
    for (let index = 0; index < sarr.length; index++) {
      const ele = sarr[index]
      if (ele.indexOf('from') > -1 && isRelative) {
        const obj = changeImport(ele, fullPath, dependencies, nochangePath)
        if (obj && obj.impName) {
          sarr[index] = ele.replace(obj.filePath, obj.impName)
          logger.info('node: ', node)
          writeFlag = true
        }
      }
    }
    if (writeFlag) {
      fileStr = sarr.join('\n')
      // 异步写入数据到文件
      fs.writeFileSync(fullPath, fileStr, { encoding: 'utf8' })
      logger.success(`Write file successful: ${fullPath}`)
    }
  } catch (error) {
    logger.error(`读取文件失败,文件名: ${fullPath} `)
  }
}

/**
 * @description: Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
export function wirteJsNodes(data: string, filePath: string): void {
  const file = path.resolve(rootPath, filePath)
  const content = `export default ${data}`
  fs.writeFileSync(file, content, { encoding: 'utf8' })
  logger.success(`Write file successful: ${filePath}`)
}
