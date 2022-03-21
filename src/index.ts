import fs from 'fs'
import path from 'path'

/**
 * @description:Gets the header comment of the file  获取文件的头部注释
 * @param {*} file
 * @return {*}
 */
function getFile(file: fs.PathOrFileDescriptor) {
  const str = fs.readFileSync(file, 'utf-8')
  const size = str.length
  const sarr = str.split(/[\n,]/g)
  const rowSize = sarr.length
  const f =
    sarr[0].indexOf('eslint') === -1 &&
    (sarr[0].indexOf('-->') > -1 || sarr[0].indexOf('*/') > -1 || sarr[0].indexOf('//') > -1)
      ? sarr[0]
      : ''
  return { note: f, size, rowSize }
}

type ItemType = {
  name: string
  isDir: boolean
  level: number
  note: string
  size: number
  suffix: string
  rowSize: number
  children?: ItemType[]
}

type secoutType = { rowTotleNumber: number; sizeTotleNumber: number; coutObj: { [key: string]: number } }

/**
 * @description:Generate node information for all files 生成所有文件的node信息
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
  //File filtering -- full name with suffix required  文件过滤--需要全称带后缀
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
  //File suffix contains only  文件后缀只包含
  let include = ['.js', '.vue', '.ts']

  if (option) {
    ignore = option.ignore || ignore
    include = option.include || include
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
    //Sort folders and files, otherwise the generated will not correspond to the opening order of the editor 对文件夹和文件进行排序,要不然生成的和编辑器打开的顺序不对应
    .sort((a, b) => {
      if (!a.isDir && b.isDir) return 1
      if (a.isDir && !b.isDir) return -1
      if ((a.isDir && b.isDir) || (!a.isDir && !b.isDir)) return 0
      return 0
    })
  for (let index = 0; index < files.length; index += 1) {
    const item = files[index]
    //Folder filtering is handled here  这里处理文件夹过滤
    const foldFlag = ignore.findIndex((obj: string) => obj === item.name)
    if (foldFlag === -1) {
      const fullPath = path.join(dir, item.name)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      if (isDir) {
        //recursion 递归
        getFileNodes(option, (item.children = []), fullPath, level + 1)
        nodes.push(item)
      } else {
        const i = fullPath.lastIndexOf('.')
        const lastName = fullPath.substring(i)
        //File filtering is handled here 这里处理文件过滤
        if (include.includes(lastName)) {
          const obj = getFile(fullPath)
          Object.assign(item, obj)
          item.suffix = lastName
          nodes.push(item)
        }
      }
    }
  }
  return nodes
}

/**
 * @description:Recursive file name + note  递归得到文件名+note
 * @param {Array} datas
 * @param {string} keys
 * @return {*}
 */
function getNote(datas: Array<ItemType>, keys?: string[]) {
  const nodes = keys || []
  datas.forEach((obj: ItemType, index: Number) => {
    const last = index === datas.length - 1
    if (obj.children) {
      //fold
      const md = setMd(obj, last)
      nodes.push(md)
      getNote(obj.children, nodes)
    }
    // file
    else {
      const md = setMd(obj, last)
      nodes.push(md)
    }
  })
  return nodes
}

/**
 * @description:One obj generates one line of text  一个obj生成一个一行文字
 * @param {ItemType} obj
 * @param {Boolean} last  Is it the last one  是不是最后一个
 * @return {*}
 */
function setMd(obj: ItemType, last: Boolean): string {
  let filesString = ''
  const blank = '│ '.repeat(obj.level) // 重复空白
  const pre = `${blank}${last ? '└──' : '├──'} ${obj.name}`
  if (obj.isDir) {
    filesString += `${pre}\n`
  } else {
    filesString += `${pre}            ${obj.note}\n`
  }
  return filesString
}

/**
 * @description: Write the result to JS file 把结果写入到js文件
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
 * @description:Thousands format 千分位格式化
 * @param {num} To format a number 要格式化数字
 * @return {string}
 */
function format(num: number) {
  var reg = /\d{1,3}(?=(\d{3})+$)/g
  return (num + '').replace(reg, '$&,')
}
/**
 * @description: Generate statistics MD 生成统计md
 * @param {object} option
 * @return {*}
 */
function setCountMd(obj: secoutType) {
  const { rowTotleNumber, sizeTotleNumber, coutObj } = obj
  let countMd = ''
  let totle=0
  for (const key in coutObj) {
    const ele = coutObj[key]
    totle += ele
    countMd += `The suffix is ${key} has ${ele} files\n`
  }
   countMd += `The totle  has ${totle} files\n`
  let md = `Total number of file lines: ${format(rowTotleNumber)},
Total number of codes: ${format(sizeTotleNumber)} \n`
  md = countMd + md
  return md
  // wirteMd(md, `${path.resolve('./')}\\count-md.md`)
}
/**
 * @description: Get statistics 得到统计
 * @param {Array} nodes
 * @return {*}
 */
function getCountMd(datas: Array<ItemType>) {
  let rowTotleNumber = 0
  let sizeTotleNumber = 0
  const coutObj: { [key: string]: number } = {}
  function getDeatle(nodes: Array<ItemType>) {
    nodes.forEach((obj: ItemType) => {
      if (obj.children) getDeatle(obj.children)
      else {
        if (!coutObj.hasOwnProperty(obj.suffix)) coutObj[obj.suffix] = 0
        coutObj[obj.suffix]++
        rowTotleNumber += obj.rowSize
        sizeTotleNumber += obj.size
      }
    })
  }
  getDeatle(datas)
  return {
    rowTotleNumber,
    sizeTotleNumber,
    coutObj
  }
}

/**
 * @description: Generate MD 生成md
 * @param {object} option
 * @return {*}
 */
export function getMd(option?: { ignore: string[] | undefined; include: string[] | undefined } | undefined) {
  console.log('\x1B[36m%s\x1B[0m', '*** run location: ', path.resolve('./')+'\n')
  const nodes = getFileNodes(option)
  // 得到md对象
  // wirteJs(JSON.stringify(nodes), __dirname + '\\readme-file.js')
  const countMdObj = getCountMd(nodes)
  const coutMd = setCountMd(countMdObj)
  console.log('\x1B[33m%s\x1b[0m', coutMd)
  const note = getNote(nodes) // 得到所有note的数组
  const md = note.join('')+'\n' // 数组转字符串
  if (md.length > 0) {
    console.log('\x1B[36m%s\x1B[0m', '*** Automatic generation completed ! ')
  }

  return md + coutMd
}

/**
 * @description:Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
export function wirteMd(data: string, filePath: string) {
  const file = path.resolve(__dirname, filePath)
  // 异步写入数据到文件
  fs.writeFile(file, data, { encoding: 'utf8' }, () => {
    console.log('Write successful')
  })
}
