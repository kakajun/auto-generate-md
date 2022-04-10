// 专门处理文件名字重命名

import fs from 'fs'
import path from 'path'
interface fileObjType {
  [key: string]: any
}
let fileObj = {} as fileObjType // 搞个全局变量接收
// 封装一个专门使用判断是否为目录的函数
async function dir(path: string) {
  return new Promise((resolve) => {
    fs.stat(path, (err, data) => {
      if (err) {
        throw err
      }
      data.isDirectory() ? resolve(true) : resolve(false)
    })
  })
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
export async function renameKebabCase(filePath: string) {
  return new Promise<void>((resolve) => {
    // 根据文件路径读取文件，返回文件列表
    fs.readdir(filePath, async (err, files) => {
      if (err) {
        throw err
      }
      await Promise.all(
        // 遍历读取到的文件列表
        files.map(async (filename) => {
          // 获取当前文件的绝对路径
          const filedir = path.join(filePath, filename)
          const isCamelFile = checkCamelFile(filedir) // 驼峰文件
          if (await dir(filedir)) {
            if (!filedir.includes('/assets')) {
              await renameKebabCase(filedir) // 递归，如果是文件夹就继续遍历
            }
          } else {
            if (isCamelFile) {
              // 写入file
              await writeFile(filename)
              // 修改文件名
              await replaceName(filePath, filename)
            }
          }
        })
      )
      resolve()
    })
  })
}

/**
 * 检测驼峰文件名
 * @param fileName 文件名
 */
export function checkCamelFile(fileName: string) {
  return /([a-z])([A-Z])/.test(fileName) || /([A-Z])/.test(fileName)
}

/**
 * 重命名文件 CamelCase || PascalCase => kebab-case
 * @param filePath 文件相对路径
 * @param fileName 文件名
 */
function replaceName(filePath: string, filename: string) {
  const oldPath = filePath + '/' + filename
  const newPath = filePath + '/' + toKebabCase(filename)
  return new Promise<void>((resolve) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
       throw err
      } else console.log(filename + ' is done')
      resolve()
    })
  })
}

/**
 * 将修改的文件数据写入file
 * @param fileName 文件名
 */
function writeFile(filename: string) {
  const newFileName = toKebabCase(filename)
  fileObj[filename] = newFileName
  return new Promise<void>((resolve) => {
    fs.writeFile('./data.json', JSON.stringify(fileObj), 'utf8', (err) => {
      if (err) {
        console.warn(err)
      }
      resolve()
    })
  })
}

function toKebabCase(str: string) {
  const regex = /[A-Z]/g
  return fistLetterLower(str).replace(regex, (word: string) => {
    return '-' + word.toLowerCase()
  })
}

/**
 * 将单个字符串的首字母小写
 * @param str 字符串
 */
function fistLetterLower(str: string | String) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}
