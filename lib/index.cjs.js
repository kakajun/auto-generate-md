/*!
 * agmd v0.0.9
 * author:majun <253495832@qq.com>
 * Thu Dec 16 2021 23:57:32 GMT+0800 (中国标准时间)
 */
var __create = Object.create
var __defProp = Object.defineProperty
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __getOwnPropNames = Object.getOwnPropertyNames
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __markAsModule = (target) => __defProp(target, '__esModule', { value: true })
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true })
}
var __reExport = (target, module2, copyDefault, desc) => {
  if ((module2 && typeof module2 === 'object') || typeof module2 === 'function') {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== 'default'))
        __defProp(target, key, {
          get: () => module2[key],
          enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable
        })
  }
  return target
}
var __toESM = (module2, isNodeMode) => {
  return __reExport(
    __markAsModule(
      __defProp(
        module2 != null ? __create(__getProtoOf(module2)) : {},
        'default',
        !isNodeMode && module2 && module2.__esModule
          ? { get: () => module2.default, enumerable: true }
          : { value: module2, enumerable: true }
      )
    ),
    module2
  )
}
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return (
      (cache && cache.get(module2)) ||
      ((temp = __reExport(__markAsModule({}), module2, 1)), cache && cache.set(module2, temp), temp)
    )
  }
})(typeof WeakMap !== 'undefined' ? /* @__PURE__ */ new WeakMap() : 0)

// src/index.ts
var src_exports = {}
__export(src_exports, {
  getFileNodes: () => getFileNodes,
  getMd: () => getMd
})
var import_fs = __toESM(require('fs'))
var import_path = __toESM(require('path'))
function getFile(file) {
  const str = import_fs.default.readFileSync(file, 'utf-8')
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
function getFileNodes(nodes = [], dir = import_path.default.resolve('./'), level = 0) {
  const files = import_fs.default
    .readdirSync(dir)
    .map((item) => {
      const fullPath = import_path.default.join(dir, item)
      const isDir = import_fs.default.lstatSync(fullPath).isDirectory()
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
      const fullPath = import_path.default.join(dir, item.name)
      const isDir = import_fs.default.lstatSync(fullPath).isDirectory()
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
  console.log('[36m%s[0m', '*** run location: ', import_path.default.resolve('./'))
  const nodes = getFileNodes()
  const note = getNote(nodes)
  const md = note.join('')
  if (md.length > 0) {
    console.log('[36m%s[0m', '*** Automatic generation completed ! ')
  }
  return md
}
module.exports = __toCommonJS(src_exports)
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    getFileNodes,
    getMd
  })
//# sourceMappingURL=index.cjs.js.map
