import fs from 'fs'
import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { createConsola } from 'consola'
import { getDependencies } from '../utils/router-utils'
import type { ItemType } from '../types'
const logger = createConsola({
  level: 4
})

const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * 检查当前目录是否为项目根目录。
 * 根据是否存在 package.json 文件来判断。
 */
function isRootDirectory(): boolean {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  try {
    fs.accessSync(packageJsonPath, fs.constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

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
        if (isRootDirectory()) {
          await writeToFile(ele, true, nochangePath)
        }
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

  const lastName = path.extname(absoluteImport)

  if (!lastName) {
    const suffixes = ['.ts', '.vue', '.tsx', '.js', '/index.js', '/index.vue']
    for (const suffix of suffixes) {
      if (fs.existsSync(absoluteImport + suffix)) {
        absoluteImport += suffix
        // logger.info('补充后缀:', absoluteImport + suffix)
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
export async function writeToFile(node: ItemType, isRelative?: Boolean, nochangePath?: Boolean) {
  const { fullPath } = node
  const packageJsonPath = path.join(rootPath, 'package.json')
  const dependencies = await getDependencies(packageJsonPath)

  try {
    const fileStr = await readFile(fullPath, 'utf-8')
    const lines = fileStr.split(/[\n]/g)

    // 使用 map() 来处理每一行
    const updatedLines = lines.map((line) => {
      if (line.includes('from') && isRelative) {
        const obj = changeImport(line, fullPath, dependencies, nochangePath)
        if (obj && obj.impName) {
          // 使用模板字符串来增加可读性
          logger.info(`Updating import in node: ${node}`)
          return line.replace(obj.filePath, obj.impName)
        }
      }
      return line
    })

    // 检查是否有任何变化
    if (updatedLines.join('\n') !== fileStr) {
      await writeFile(fullPath, updatedLines.join('\n'), 'utf-8')
      logger.success(`Write file successful: ${fullPath}`)
    }
  } catch (error) {
    // 提供更详细的错误信息
    logger.error(`Error reading file: ${fullPath}, Error: ${error}`)
  }
}
/**
 * @description: Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
export async function wirteJsNodes(data: string, filePath: string): Promise<void> {
  const file = path.resolve(rootPath, filePath)
  const content = `export default ${data}`
  await writeFile(file, content, { encoding: 'utf8' })
  logger.success(`Write file successful: ${filePath}`)
}
