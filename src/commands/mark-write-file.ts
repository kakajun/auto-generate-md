/**
 *================================================
 *@date:2022/04/04
 *@author:mj
 *@desc:对打上标记的文件进行分类写入, 分步骤写方法, 虽然对于性能有影响, 但一点点算什么, 能够分步骤调试最好, 不要这个步骤, 直接注释掉这个方法就行
 *
 *================================================
 */
import createDebugger from 'debug'
import { findNodes } from './mark-file'
import { ItemType } from './get-file'
import fs from 'fs-extra';

const debug = createDebugger('mark-write-file')
debug.enabled = true

/**
 * @desc:  递归文件子依赖创建文件- 文件外递归
 * @author: majun
 * @param {ItemType} nodes
 * @param {string} name
 * @param {string} path  绝对路径
 * @param {string} rootPath   确定哪一级开始创建文件夹
 */
export  function markWriteFile(nodes: ItemType[], name: string, path: string, rootPath: string) {
  // debug('入参: ', name, path)
  // 通过文件地址, 找到nodes的依赖地址, 把依赖文件也打标记
  const node = findNodes(nodes, path)
  // debug('查找的node: ', node)
  if (node && node.imports) {
    // 得到标记
    const belongTo = node.belongTo
    if (belongTo.length > 0) {
      setDispFileNew(path, name, rootPath)
    }
    // 找到有子文件了,循环它
    for (let index = 0; index < node.imports.length; index++) {
      const element = node.imports[index]
      // debug('依赖文件: ', element)
      // 如果文件存在
      if (fs.existsSync(path)) {
        // 继续递归,直到子文件没有子文件
        markWriteFile(nodes, name, element, rootPath)
      } else {
        console.error('文件不存在', path)
      }
    }
  }
}

/**
 * @desc: 功能就是找到文件然后copy文件,
 * @author: majun
 * @param {string} path
 * @param {string} name
 * @param {string} rootPath
 */
function setDispFileNew(path: string, name: string, rootPath: string) {
  // debug('copyFile入参: ', name, path, rootPath)
   const relative = path.replace(rootPath, '')
   const originPath = path
   const writeFileName = rootPath + '\\' + name + relative
  //  debug('originPath: ', originPath)

   try {
     fs.copy(originPath, writeFileName)
        debug('写入文件success! : ', writeFileName)
   } catch (err) {
     console.error(err)
   }
}

/**
 * @desc: 给一个路径和包名,然后就创建文件夹,如果存在那就啥也不管
 * @author: majun
 * @param {type} params
 */
export function setFolder(path: string, name: string) {
  // debug('setFolder入参: ', path, name)
  const foldNameArrs = path.split('\\')
  const latArr = foldNameArrs.pop()  // 最后一位和要创建的一位一样,那么就会无限创建文件夹
  if (path.indexOf('.') > -1 || latArr===name) {
    console.error('创建文件夹异常:')
    // debug('name: ', name)
    // debug('path: ', path)
    return
  }
  //路径最后一位有斜杆,那不处理,----------------- 这里给代码加点容错, 增加代码健壮性
  let newPath = path.substring(path.length - 1) === '\\' ? path : path + '\\'
  if (!fs.existsSync(newPath + name)) {
    fs.mkdirSync(newPath + name)
  }
}
