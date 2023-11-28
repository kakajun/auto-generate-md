/* 整个文件主要把绝对路径修改为相对路径 */
import { ItemType } from './get-file'
import fs from 'fs'
import path from 'path'
import logger from '../shared/logger'
import createDebugger from 'debug'
const debug = createDebugger('change-path')
debug.enabled = true
const rootPath = process.cwd().replace(/\\/g, '/')

/**
 * @desc: 递归循环所有文件
 * @author: majun
 * @param {Array} nodes      整个文件的nodes
 */
export async function changePath(nodes: ItemType[], nochangePath?: Boolean) {


  async function getNode(objs: ItemType[]) {
    for (let index = 0; index < nodes.length; index++) {
      const ele = objs[index]
      if (ele.children) {
        await getNode(ele.children)
      } else {
        // TODO 这里先写死绝对转相对, 后面如果想相对都转绝对, 可以改这里
        witeFile(ele, true, nochangePath)
      }
    }
  }
  await getNode(nodes)
}
/**
 * @desc: 这里返回没有@ 符号的路径
 * @author: majun
 * @param {string} absoluteImport  依赖本身名字
 * @param {string} fullPath  文件本身绝对地址
 */
export function getRelatPath(absoluteImport: string, fullPath: string) {
  let relatPath = path.relative(path.dirname(fullPath), absoluteImport) // 转回相对路径
  relatPath = relatPath.replace(/\\/g, '/')
  if (relatPath.indexOf('.') !== 0) {
    relatPath = './' + relatPath
  }
  return relatPath
}

/**
 * @desc: 补后缀的方法+替换前缀
 * @author: majun
 * @param {string} filePath  正则匹配到的依赖路径
 * @param {string} fullPath  本身文件名路径
 * @param {string} impName   正确的名字
 */
export function makeSuffix(filePath: string, fullPath: string) {
  let absoluteImport = ''
  // 如果有@符号的
  if (filePath.indexOf('@') > -1) {
    debug('!!!!!!!!!filePath: ', filePath)
    absoluteImport = filePath.replace('@', process.cwd())
  } else {
    absoluteImport = path.resolve(path.dirname(fullPath), filePath)
  }
  debug('makeSuffix 入参: absoluteImport', absoluteImport)
  const lastName = path.extname(absoluteImport)
  debug('lastName', lastName)
  // 假如没有后缀,补上
  if (!lastName) {
    debug('!!!!!!!!!!!缺后缀文件: ', absoluteImport)
    // 获取绝对路径
    const suffix = ['.js', '.ts', '.vue', '.tsx', '/index.js', '/index.vue']
    for (let j = 0; j < suffix.length; j++) {
      const fixStr = suffix[j]
      if (fs.existsSync(absoluteImport + fixStr)) {
        // 把改好的替换回去
        debug('补全的文件: ', absoluteImport + fixStr)
        absoluteImport = absoluteImport + fixStr
        break
      }
    }
  }
  return absoluteImport.replace(/\\/g, '/')
}

/**
 * @desc: 根据一行代码匹配import的详细内容  TODO 这里还得优化
 * @author: majun
 */
export function getImportName(ele: string,dependencies:string[]) {
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
 * @author: majun
 * @param {string} ele    找到的行引入
 * @param {string} fullPath  文件的全路径
 */
export function changeImport(ele: string, fullPath: string,dependencies:string[], nochangePath?: Boolean) {

  const obj = {
    impName: '',
    filePath: '',
    absoluteImport: ''
  }
  const impName = getImportName(ele,dependencies)
  if (impName) {
    // 依赖的具体名字
    obj.filePath = impName
    debug('!!!!!!!!!匹配imp: ', impName)
    // 先补后缀
    obj.absoluteImport = makeSuffix(obj.filePath, fullPath)
    debug('补过后', obj.absoluteImport)
    if (!nochangePath) {
      // 后改相对路径
      obj.impName = getRelatPath(obj.absoluteImport, fullPath)
      debug('相对路径: ', obj.impName)
    }
  }
  return obj
}
/**
   * @desc:  写文件
   * @author: majun

   * @param {string} file  目标地址
   */
export function witeFile(node: ItemType, isRelative?: Boolean, nochangePath?: Boolean) {
  const { fullPath } = node
  const dependencies =[]
   if (fs.existsSync(rootPath + '/package.json')) {
     const pkg = require(rootPath + '/package.json')
     if (pkg.devDependencies) {
       dependencies.push(...Object.keys(pkg.devDependencies));
     } else if (pkg.dependencies) {
        dependencies.push(...Object.keys(pkg.dependencies))
     }


  }
  try {
    let writeFlag = false // 如果啥都没改, 不更新文件
    let fileStr = fs.readFileSync(fullPath, 'utf-8')
    const sarr = fileStr.split(/[\n]/g)
    for (let index = 0; index < sarr.length; index++) {
      const ele = sarr[index]
      if (ele.indexOf('from') > -1 && isRelative) {
        const obj = changeImport(ele, fullPath,dependencies, nochangePath)
        if (obj.impName) {
          sarr[index] = ele.replace(obj.filePath, obj.impName)
          debug('node: ', node)
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
export function wirteJsNodes(data: string, filePath: string) {
  const file = path.resolve(process.cwd(), filePath)
  const pre = 'export default'
  // 异步写入数据到文件
  fs.writeFileSync(file, pre + data, { encoding: 'utf8' })
  logger.success(`Write file successful: ${filePath}`)
}
