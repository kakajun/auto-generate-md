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
 *  特别说明: 之前想着自己造轮子,递归写了好几个, 自己都调晕了, 在下面注释的好大段代码写和调试花了半天, 结果还有写文件为空的bug解决不了, 不知道原因是什么,
 *  后面网上找到插件fs-extra, 结果就下面一段代码轻而易举就实现了功能, 还只花了几分钟,靠.......
  * *******************总结教训, 不要轻易自己造轮子, 否则轮子砸到脚痛还不讲, 还得进医院***********************
 * @author: majun
 * @param {string} path
 * @param {string} name
 * @param {string} rootPath
 */
function setDispFileNew(path: string, name: string, rootPath: string) {
  debug('copyFile入参: ', name, path, rootPath)
   const relative = path.replace(rootPath, '')
   const originPath = path
   const writeFileName = rootPath + '\\' + name + relative
   debug('originPath: ', originPath)
   debug('写入文件: ', writeFileName)
   try {
     fs.copy(originPath, writeFileName)
     console.log('success!')
   } catch (err) {
     console.error(err)
   }
}

/**
 * @desc: 这里递归创建文件夹和写文件-文件内递归, 文件内处理, 不需要node
 *       怎么知道原始路径? 就是把name一级干掉即可,干掉name级别就和外面的一模一样
 * 这里就干两件事,1 创建文件夹, 2 创建文件

 *
 * @author: majun
 * @param {string} path    path 初始化时是原绝对路径, 后面就是已创建文件夹后的路径
 * @param {string} name   一直是工程名字
 * @param {string} rootPath  一直是跟路径
 * @param {string} restName  递归创建文件夹的剩余name
 */
// function setDispFile(path: string, name: string, rootPath: string, restName?: string) {
//   debug('setDispFile入参: ', path, name)
//   let seconFlag = path.indexOf(name) > -1
//   // 1. 依次找到最外层文件夹
//   const relative =restName?restName: path.replace(rootPath + '\\', '')
//   const foldNameArrs = relative.split('\\')
//   debug('relative: ', relative)
//   debug('foldNameArrs: ', foldNameArrs)
//   //如果是文件, copy文件
//   if (foldNameArrs[0].indexOf('.') > -1) {
//     if (seconFlag) {
//       copyFile(path, name, foldNameArrs[0]);
//     } else {
//       const newPath = rootPath + '\\' + name + '\\' + relative
//       copyFile(newPath, name, foldNameArrs[0])
//     }
//   } else {
//     // 下面处理文件夹递归关系
//     if (seconFlag) {
//       //还不是文件, 文件夹创建
//       setFolder(path, foldNameArrs[0])
//       path = path + '\\' + foldNameArrs[0]
//     } else {
//       //还不是文件, 文件夹创建--第一次
//       setFolder(rootPath + '\\' + name, foldNameArrs[0])
//       path = rootPath + '\\' + name + '\\' + foldNameArrs[0]
//     }
//     // 递归之前要去掉已建文件夹
//      foldNameArrs.splice(0, 1)
//     const newName = foldNameArrs.join('\\')
//     debug('递归参数: ', path, newName)
//     setDispFile(path, name, rootPath, newName)
//   }
// }

/**
 * @desc: 读取原文件,写入到新地址
 * @author: majun
 * @param {string} path  path 一定是带name的新地址
 * @param {string} name
 * @param {string} filName 要copy的文件名
 */
// export function copyFile(path: string, name: string, filName: string) {
//   debug('copyFile入参: ', name, path, filName)
//   const origin = path.replace(name + '\\', '')
//   const flag = path.indexOf('.')>-1
//   const originPath = flag ? origin : origin + '\\' + filName
//   const writeFileName = flag ? path : path + '\\' + filName
//   debug('originPath: ', originPath)
//    debug('写入文件: ', writeFileName)
//   const str = fs.readFileSync(originPath, 'utf-8')
//   console.log(str, "666")
//       const str2 = fs.readFileSync(
//         'D:\\worker\\reconstruct-relative-path\\unuse\\components\\test\\deep\\user-ruler.vue',
//         'utf-8'
//       )
//       console.log(str2.toString(), '21321')
//   // 异步写入数据到文件
//   fs.writeFile(writeFileName, str, { encoding: 'utf8' }, () => {
//     console.log('newfile write successful', writeFileName)
//   })
// }

// function copyFile(path: string, name: string, filName: string) {
//   debug('copyFile入参: ', name, path, filName)
//   const origin = path.replace(name + '\\', '')
//   const flag = path.indexOf('.') > -1
//   const originPath = flag ? origin : origin + '\\' + filName
//   const writeFileName = flag ? path : path + '\\' + filName
//   debug('originPath: ', originPath)
//   debug('写入文件: ', writeFileName)
//   try {
//     fs.copy(originPath, writeFileName)
//     console.log('success!')
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * @desc: 给一个路径和包名,然后就创建文件夹,如果存在那就啥也不管
 * @author: majun
 * @param {type} params
 */
export function setFolder(path: string, name: string) {
  debug('setFolder入参: ', path, name)
  const foldNameArrs = path.split('\\')
  const latArr = foldNameArrs.pop()  // 最后一位和要创建的一位一样,那么就会无限创建文件夹
  if (path.indexOf('.') > -1 || latArr===name) {
    console.error('创建文件夹异常:')
    debug('name: ', name)
    debug('path: ', path)
    return
  }
  //路径最后一位有斜杆,那不处理,----------------- 这里给代码加点容错, 增加代码健壮性
  let newPath = path.substring(path.length - 1) === '\\' ? path : path + '\\'
  if (!fs.existsSync(newPath + name)) {
    fs.mkdirSync(newPath + name)
  }
}
