import createDebugger from 'debug'
const debug = createDebugger('get-file.test')
debug.enabled = true
import { setDispFileNew } from '../src/commands/mark-write-file'

test('mark-write-file.test--找到文件然后copy文件', (done) => {
  const file = process.cwd() + '\\test\\temp\\app-file-test.vue'
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
