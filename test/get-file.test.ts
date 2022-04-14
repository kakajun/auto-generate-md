import { getFile } from '../src/commands/get-file'
import {creatFile} from './utils';
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('get-file.test')
debug.enabled = false
describe('get-file的测试', () => {
  test('getFile--获取注释', (done) => {
    const file = rootPath + '/test/temp/app-file-test.vue'
    try {
      creatFile(file).then(() => {
        const obj = getFile(file)
        done()
        expect(obj).toEqual({
          note: '// 我就是个注释',
          rowSize: 4,
          size: 63,
          imports: [rootPath + '/test/temp/aa.vue']
        })
      })
    } catch (error) {
      done(error)
    }
  })
})
