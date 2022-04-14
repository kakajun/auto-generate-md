import fs from 'fs'
import { getFile } from '../src/commands/get-file'
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('get-file.test')
debug.enabled = false
describe('get-file的测试', () => {
  test('getFile--获取注释', (done) => {
    const str = `// 我就是个注释
<script setup>
import UserRuler from './aa'
</script>`
    const file = rootPath + '/test/temp/app-file-test.vue'
    try {
      fs.writeFile(file, str, { encoding: 'utf8' }, () => {
        debug('Write app-file-test successful')
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
