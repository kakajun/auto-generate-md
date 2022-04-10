import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('get-file.test')
debug.enabled = true
import { setDispFileNew, markWriteFile } from '../src/commands/mark-write-file'
import nodes from './nodes'
test('mark-write-file.test--找到文件然后copy文件', (done) => {
  const file = rootPath + '/test/temp/app-file-test.vue'
  try {
    async function get() {
      await setDispFileNew(file, 'base')
      done()
    }
    get()
  } catch (error) {
    done(error)
  }
})

test('mark-write-file.test--找到文件然后copy文件', (done) => {
  const file = rootPath + '/test/temp/app-file-test.vue'
  try {
    async function get() {
      await markWriteFile(nodes, 'base', file)
      done()
    }
    get()
  } catch (error) {
    done(error)
  }
})
