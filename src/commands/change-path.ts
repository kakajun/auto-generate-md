/* 整个文件主要把绝对路径修改为相对路径 */
import { ItemType } from './get-file'
import fs from 'fs'
import path from 'path'
import createDebugger from 'debug'
const debug = createDebugger('change-path')
debug.enabled = true
/**
 * @desc: 递归循环所有文件
 * @author: majun
 * @param {Array} nodes      整个文件的nodes
 */
export function changePath(nodes: Array<ItemType>) {
  function getNode(nodes: Array<ItemType>) {
    for (let index = 0; index < nodes.length; index++) {
      const ele = nodes[index]
      if (ele.children) {
        getNode(ele.children)
      } else {
        // TODO 这里先写死绝对转相对, 后面如果想相对都转绝对, 可以改这里
        witeFile( ele, true)
      }
    }
    // nodes.forEach((ele) => {
    //   if (ele.children) {
    //     getNode(ele.children)
    //   } else {
    //     // TODO 这里先写死绝对转相对, 后面如果想相对都转绝对, 可以改这里
    //     witeFile(ele, true)
    //   }
    // })
  }
  getNode(nodes)
}
/**
 * @desc: 这里返回没有@ 符号的路径
 * @author: majun
 * @param {string} absoluteImport  依赖本身名字
 * @param {string} fullPath  文件本身绝对地址
 */
export function getRelatPath(absoluteImport: string,fullPath: string) {
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
export function makeSuffix(filePath: string,fullPath:string) {
  let absoluteImport = ''
  // 如果有@符号的
  if (filePath.indexOf('@') > -1) {
        debug('!!!!!!!!!filePath: ', filePath)
    absoluteImport = filePath.replace('@', path.resolve('./'))
  } else {
    absoluteImport = path.resolve(path.dirname(fullPath), filePath)
  }
  debug('makeSuffix 入参: absoluteImport', absoluteImport)
  const lastName = path.extname(absoluteImport)
  debug('lastName', lastName)
  // 假如没有后缀,补上
  if (!lastName) {
    debug('!!!!!!!!!!!!!!缺后缀文件: ', absoluteImport)
    // 获取绝对路径
    const suffix = ['.js', '.ts', '.vue', '/index.js', '/index.vue']
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
  const nomoreImport = path.normalize(absoluteImport)
  return nomoreImport
}

/**
 * @desc: 找到import并返回全路径和原始路径
 * @author: majun
 * @param {string} ele    找到的行引入
 * @param {string} fullPath  文件的全路径
 */
export function changeImport(ele: string, fullPath: string) {
   debug('changeImport入参: ', ele, fullPath)
  let obj = {
    impName: '',
    filePath:''
  }
  // 注释的不转,其他公共也不转
  const ignore = ['//', '@xiwicloud/components', '@xiwicloud/lims', '@handsontable/vue']
  const flag = ignore.some((item) => ele.indexOf(item) > -1)
  const reg = /import.*[\"|\'](.*)[\'|\"]/
  // 这里只收集组件依赖, 插件依赖排除掉
  if (!flag && ele.indexOf('/') > -1) {
    const impStr = ele.match(reg)
    // 没有import的不转
    if (impStr && impStr[1]) {
      // 依赖的具体名字
      obj.filePath = impStr[1]
        // debug('!!!!!!!!!匹配imp: ', impStr[1])
      // 先补后缀
      const  absoluteImport = makeSuffix(obj.filePath, fullPath)
      console.log('补过后', absoluteImport)
      // 后改相对路径
      obj.impName = getRelatPath(absoluteImport, fullPath)
    }
  }
  return obj
}
  /**
   * @desc:  写文件
   * @author: majun

   * @param {string} file  目标地址
   */
  export function witeFile( node: ItemType, isRelative?: Boolean) {
    const { fullPath, imports = [] } = node
    let fileStr = fs.readFileSync(fullPath, 'utf-8')
    let writeFlag = false // 如果啥都没改, 不更新文件
    // fileStr = '// 我加注释 \n' + fileStr
    const sarr = fileStr.split(/[\n]/g)
    for (let index = 0; index < sarr.length; index++) {
      const ele = sarr[index]
      if (ele.indexOf('import')>-1&& isRelative) {
        const obj = changeImport(ele, fullPath)
        if (obj.impName) {
            sarr[index] = ele.replace(obj.filePath, obj.impName)
            debug('!!!!!!!!!修改@符号: ', sarr[index])
            writeFlag = true
            debug('收集依赖: ', obj.impName, fullPath)
            // 所有要赋值前都做一个转换
            let changeNameP = obj.impName.replace(/\//g, '\\')
            imports.push(changeNameP)
        }
      }
    }

  if (writeFlag) {
    fileStr = sarr.join('\n')
    // 异步写入数据到文件
    fs.writeFile(fullPath, fileStr, { encoding: 'utf8' }, () => {
      console.log('Write successful-------' + fullPath)
    })
  }
}

/**
 * @description: Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
export function wirteJsNodes(data: string, filePath: string) {
  const file = path.resolve(__dirname, filePath)
  const pre = 'export default'
  // 异步写入数据到文件
  fs.writeFile(file, pre + data, { encoding: 'utf8' }, (err) => {
    console.error(err)
  })
}
