import fs from 'fs'
import path from 'path'

/**
 * @description: 获取文件的头部注释
 * @param {*} file
 * @return {*}
 */
function getFile(file: fs.PathOrFileDescriptor) {
  const str = fs.readFileSync(file, 'utf-8')
  const sarr = str.split(/[\n,]/g)
  // console.log(file);
  const f =
    sarr[0].indexOf('eslint') === -1 &&
    (sarr[0].indexOf('-->') > -1 || sarr[0].indexOf('*/') > -1 || sarr[0].indexOf('//') > -1)
      ? sarr[0]
      : ''
  // console.log(f);
  return f
}
// 过滤文件夹
const filterArr = ['img', 'styles', 'node_modules', 'LICENSE', '.git', '.github', 'dist', '.husky', '.vscode']
// 这里只获取某后缀文件的注释,需要其他这里加入
const includeArrs = ['.js', '.vue', '.ts']

export type ItemType ={
  name: string
  isDir: boolean
  level: number
  note: string
  children?: ItemType[]
}

/**
 * @description: 生成所有文件的node信息
 * @param {*} nodes
 * @param {*} dir
 * @param {*} level
 * @return {*}
 */
 export function getFileNodes(nodes: Array<ItemType> = [], dir = path.resolve('./'), level = 0): Array<ItemType> {
  const files = fs
    .readdirSync(dir)
    .map((item) => {
      const fullPath = path.join(dir, item)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      return {
        name: item,
        isDir,
        level,
        note: ''
      } as ItemType
    })
    // 对文件夹和文件进行排序,要不然生成的和编辑器打开的顺序不对应
    .sort((a, b) => {
      if (!a.isDir && b.isDir) return 1
      if (a.isDir && !b.isDir) return -1
      if ((a.isDir && b.isDir) || (!a.isDir && !b.isDir)) return 0
      return 0
    })
  for (let index = 0; index < files.length; index += 1) {
    const item = files[index]
    let note = '' // 文件注释
    const arr = filterArr.findIndex((obj) => obj === item.name)
    if (arr === -1) {
      const fullPath = path.join(dir, item.name)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      if (isDir) {
        // 递归
        getFileNodes((item.children = []), fullPath, level + 1)
      } else {
        const i = fullPath.lastIndexOf('.')
        const lastName = fullPath.substring(i)
        // 这里只获取js和vue,ts文件的注释
        if (['.js', '.vue', '.ts'].includes(lastName)) {
          note = getFile(fullPath)
        }
        item.note = note
      }
      nodes.push(item)
    }
  }
  // 控制返回时间节点,不让提前返回
  return nodes
}

/**
 * @description: 递归得到文件名+note
 * @param {*} datas
 * @param {*} keys
 * @return {*}
 */
function getNote(datas: Array<ItemType>, keys?: string[]) {
  const nodes = keys || []
  datas.forEach((obj: ItemType) => {
    if (obj.children) {
      // 文件夹
      const md = setMd(obj)
      nodes.push(md)
      getNote(obj.children, nodes)
    }
    // 文件
    else {
      const md = setMd(obj)
      nodes.push(md)
    }
  })
  return nodes
}

/**
 * @description: 一个obj生成一个一行文字
 * @param {*} obj
 * @return {*}
 */
function setMd(obj: ItemType): string {
  let filesString = ''
  // 把文件夹输出,并且level+1
  const blank = '  '.repeat(obj.level) // 重复空白
  if (obj.isDir) {
    filesString += `${blank}+ ${obj.name}\n`
  } else {
    const index = obj.name.lastIndexOf('.')
    const lastName = obj.name.substring(index)
    // 这里只获取某后缀文件的注释
    if (includeArrs.includes(lastName) || index === -1) {
      filesString += `${blank}  ${obj.name}            ${obj.note}\n`
    }
  }
  return filesString
}

export function getMd() {
  console.log('\x1B[36m%s\x1B[0m', '*** run location: ', path.resolve('./'))
  const nodes = getFileNodes()
  const note = getNote(nodes) // 得到所有note的数组
  const md = note.join('') // 数组转字符串
  if (md.length > 0) {
    console.log('\x1B[36m%s\x1B[0m', '*** Automatic generation completed ! ')
  }
  return md
}

