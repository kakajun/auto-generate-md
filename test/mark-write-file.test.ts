// import { createConsola } from 'consola'
import fs from 'fs-extra'
const rootPath = process.cwd().replace(/\\/g, '/')

import { setDispFileNew, markWriteFile } from '../src/commands/mark-write-file'
import { nodeOne } from './utils/nodes'
// const logger = createConsola({
//   level: 4
// })
describe('mark-write-file.test的测试', () => {
  test('setDispFileNew--找到文件然后copy文件', (done) => {
    const file = rootPath + '/temp/app-file-test.vue'
    try {
      fs.ensureFileSync(file)
      async function get() {
        await setDispFileNew(file, 'base')
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })

  test('mark-write-file--递归打标记', (done) => {
    const file = rootPath + '/temp/app-file-test.vue'
    try {
      async function get() {
        await markWriteFile(nodeOne, 'base', file)
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })
})
