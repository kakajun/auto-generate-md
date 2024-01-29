import fs from 'fs-extra'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

module.exports = async () => {
  logger.start('清空测试文件夹')
  // 你可以在这里执行一些全局初始化代码
  const foldPath = rootPath + '/temp'
  const foldPath2 = rootPath + '/test2'
  function deleteFolderRecursive(p: string) {
    if (fs.existsSync(p)) {
      fs.readdirSync(p).forEach((file) => {
        const curPath = `${p}/${file}`
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(p)
    }
  }

  deleteFolderRecursive(foldPath)
  deleteFolderRecursive(foldPath2)
}
