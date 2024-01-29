import fs from 'fs-extra'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const foldPath = rootPath + '/temp'
const logger = createConsola({
  level: 4
})

beforeAll(() => {
  logger.info('new unit test start')
  fs.ensureDirSync(foldPath)
  // 你可以在这里执行一些全局初始化代码
})
