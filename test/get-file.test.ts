import { getFile } from '../src/commands/get-file'
import { creatFile } from './utils'
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('get-file.test')
debug.enabled = false
describe('get-file的测试', () => {
  test('getFile--获取注释', (done) => {
    async function get() {
      const file = rootPath + '/test/temp/app-file-test.vue'
      const file2 = rootPath + '/test/temp/aa.vue'
      try {
        await creatFile(file)
        await creatFile(file2)
        const obj = getFile(file)
        done()
        expect(obj).toEqual({
          note: '// 我就是个注释',
          rowSize: 4,
          size: 63,
          imports: [rootPath + '/test/temp/aa.vue']
        })
      } catch (error) {
        done(error)
      }
    }
    get()
  })
})
