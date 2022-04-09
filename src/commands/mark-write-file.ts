/* 对打上标记的文件进行分类写入, 分步骤写方法, 虽然对于性能有影响, 但一点点算什么, 能够分步骤调试最好, 不要这个步骤, 直接注释掉这个方法就行 */
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
export async function markWriteFile(nodes: ItemType[], name: string, path: string) {
  // debug('入参: ', name, path)
  // 通过文件地址, 找到nodes的依赖地址, 把依赖文件也打标记
  const node = findNodes(nodes, path)
  // debug('查找的node: ', node)
  if (node && node.imports) {
    // 得到标记
    const belongTo = node.belongTo
    if (belongTo.length > 0) {
      await   setDispFileNew(path, name)
    }
    // 找到有子文件了,循环它
    for (let index = 0; index < node.imports.length; index++) {
      const element = node.imports[index]
      // debug('依赖文件: ', element)
      // 如果文件存在
      if (fs.existsSync(path)) {
        // 继续递归,直到子文件没有子文件
         await markWriteFile(nodes, name, element)
      } else {
        console.error('文件不存在', path)
      }
    }
  }
}

/**
 * @desc: 功能就是找到文件然后copy文件,
 * @author: majun
 * @param {string} pathN
 * @param {string} name
 * @param {string} rootPath
 */
export async function setDispFileNew(pathN: string, name: string) {
  // debug('copyFile入参: ', name, path, rootPath)
   const relative = pathN.replace(process.cwd(), '')
   const originPath = pathN
   const writeFileName = process.cwd() + '\\' + name + relative
  try {
    if (fs.existsSync(writeFileName)) return  // 如果文件都存在那算了
    await fs.copy(originPath, writeFileName)
        debug('写入文件success! : ', writeFileName)
   } catch (err) {
     console.error(err)
   }
}

