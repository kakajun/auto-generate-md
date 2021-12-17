/*!
 * agmd v0.1.0
 * author:majun <253495832@qq.com>
 * Fri Dec 17 2021 08:56:52 GMT+0800 (中国标准时间)
 */
// src/index.ts
import fs from 'fs'
import path from 'path'
function getFile(file) {
  const str = fs.readFileSync(file, 'utf-8')
  const sarr = str.split(/[\n,]/g)
  const f =
    sarr[0].indexOf('eslint') === -1 &&
    (sarr[0].indexOf('-->') > -1 || sarr[0].indexOf('*/') > -1 || sarr[0].indexOf('//') > -1)
      ? sarr[0]
      : ''
  return f
}
var filterArr = ['img', 'styles', 'node_modules', 'LICENSE', '.git', '.github', 'dist', '.husky', '.vscode']
var includeArrs = ['.js', '.vue', '.ts']
function getFileNodes(nodes = [], dir = path.resolve('./'), level = 0) {
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
      }
    })
    .sort((a, b) => {
      if (!a.isDir && b.isDir) return 1
      if (a.isDir && !b.isDir) return -1
      if ((a.isDir && b.isDir) || (!a.isDir && !b.isDir)) return 0
      return 0
    })
  for (let index = 0; index < files.length; index += 1) {
    const item = files[index]
    let note = ''
    const arr = filterArr.findIndex((obj) => obj === item.name)
    if (arr === -1) {
      const fullPath = path.join(dir, item.name)
      const isDir = fs.lstatSync(fullPath).isDirectory()
      if (isDir) {
        getFileNodes((item.children = []), fullPath, level + 1)
      } else {
        const i = fullPath.lastIndexOf('.')
        const lastName = fullPath.substring(i)
        if (['.js', '.vue', '.ts'].includes(lastName)) {
          note = getFile(fullPath)
        }
        item.note = note
      }
      nodes.push(item)
    }
  }
  return nodes
}
function getNote(datas, keys) {
  const nodes = keys || []
  datas.forEach((obj) => {
    if (obj.children) {
      const md = setMd(obj)
      nodes.push(md)
      getNote(obj.children, nodes)
    } else {
      const md = setMd(obj)
      nodes.push(md)
    }
  })
  return nodes
}
function setMd(obj) {
  let filesString = ''
  const blank = '  '.repeat(obj.level)
  if (obj.isDir) {
    filesString += `${blank}+ ${obj.name}
`
  } else {
    const index = obj.name.lastIndexOf('.')
    const lastName = obj.name.substring(index)
    if (includeArrs.includes(lastName) || index === -1) {
      filesString += `${blank}  ${obj.name}            ${obj.note}
`
    }
  }
  return filesString
}
function getMd() {
  console.log('[36m%s[0m', '*** run location: ', path.resolve('./'))
  const nodes = getFileNodes()
  const note = getNote(nodes)
  const md = note.join('')
  if (md.length > 0) {
    console.log('[36m%s[0m', '*** Automatic generation completed ! ')
  }
  return md
}
export { getFileNodes, getMd }
//# sourceMappingURL=index.esm.js.map
