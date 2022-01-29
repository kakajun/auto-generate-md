import fs from 'fs'
import path from 'path'

// var __dirname = path.resolve()

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

export type ItemType = {
  name: string
  isDir: boolean
  level: number
  note: string
  children?: ItemType[]
}

/**
 * @description:生成所有文件的node信息
 * @param {Array} nodes
 * @param {*} dir
 * @param {Number} level
 * @return {*}
 */
export function getFileNodes(
  option: { ignore: string[] | undefined; include: string[] | undefined } | undefined,
  nodes: Array<ItemType> = [],
  dir = path.resolve('./'),
  level = 0
): Array<ItemType> {
  // 文件过滤--需要全称带后缀
  let ignore = [
    'img',
    'styles',
    'node_modules',
    'LICENSE',
    '.git',
    '.github',
    'dist',
    '.husky',
    '.vscode',
    'readme-file.js',
    'readme-md.js'
  ]
  // 文件后缀只包含
  let include = ['.js', '.vue', '.ts']

  if (option) {
    ignore = option.ignore ?? ignore
    include = option.include ?? include
  }
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
    // 这里处理文件夹过滤
    const foldFlag = ignore.findIndex((obj: string) => obj === item.name)
    if (foldFlag === -1) {
      const fullPath = path.join(dir, item.name)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      if (isDir) {
        // 递归
        getFileNodes(option, (item.children = []), fullPath, level + 1)
        nodes.push(item)
      } else {
        const i = fullPath.lastIndexOf('.')
        const lastName = fullPath.substring(i)
        // 这里处理文件过滤
        if (include.includes(lastName)) {
          note = getFile(fullPath)
          item.note = note
          nodes.push(item)
        }
      }
    }
  }
  // 控制返回时间节点,不让提前返回
  return nodes
}

/**
 * @description:递归得到文件名+note
 * @param {Array} datas
 * @param {string} keys
 * @return {*}
 */
function getNote(datas: Array<ItemType>, keys?: string[]) {
  const nodes = keys || []
  datas.forEach((obj: ItemType, index: Number) => {
    const last = index === datas.length - 1
    if (obj.children) {
      // 文件夹
      const md = setMd(obj, last)
      nodes.push(md)
      getNote(obj.children, nodes)
    }
    // 文件
    else {
      const md = setMd(obj, last)
      nodes.push(md)
    }
  })
  return nodes
}

/**
 * @description: 一个obj生成一个一行文字
 * @param {ItemType} obj
 * @param {Boolean} last  是不是最后一个
 * @return {*}
 */
function setMd(obj: ItemType, last: Boolean): string {
  let filesString = ''
  // 把文件夹输出,并且level+1
  const blank = '│ '.repeat(obj.level) // 重复空白
  const pre = `${blank}${last ? '└──' : '├──'} ${obj.name}`
  if (obj.isDir) {
    filesString += `${pre}\n`
  } else {
    // console.log(last, obj.name)
    filesString += `${pre}            ${obj.note}\n`
  }
  return filesString
}

/**
 * @description: 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
// function wirteJs(data: string, filePath: string) {
//   const file = path.resolve(__dirname, filePath)
//   const pre = 'export default'
//   // 异步写入数据到文件
//   fs.writeFile(file, pre + data, { encoding: 'utf8' }, (err) => {
//     console.error(err)
//   })
// }

/**
 * @description: 生成md
 * @param {object} option
 * @return {*}
 */
export function getMd(option?: { ignore: string[] | undefined; include: string[] | undefined } | undefined) {
  console.log('\x1B[36m%s\x1B[0m', '*** run location: ', path.resolve('./'))
  const nodes = getFileNodes(option)
  // 得到md对象
  // wirteJs(JSON.stringify(nodes), __dirname + '\\readme-file.js')
  const note = getNote(nodes) // 得到所有note的数组
  const md = note.join('') // 数组转字符串
  if (md.length > 0) {
    console.log('\x1B[36m%s\x1B[0m', '*** Automatic generation completed ! ')
  }
  return md
}
