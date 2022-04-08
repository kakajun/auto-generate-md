
import fs from 'fs'
// import { getFile } from '../src/commands/get-file'
import createDebugger from 'debug'
const debug = createDebugger('get-file.test')
debug.enabled = true
test('getFile--获取注释', (done) => {
  // 1. 随机创建一个文件
  const str = ` // 我就是个注释
  <script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
  const file = process.cwd()+ '\\unuse\\test\\temp\\AppFileTest.vue'
  console.log(file,"7777")
  try {
    fs.writeFile(file, str, { encoding: 'utf8' }, () => {
     console.log('Write AppFileTest successful')
    // const obj = getFile(file)
    done()
    // fs.unlinkSync(file)
    // expect(obj).toEqual({ note: ' // 我就是个注释', rowSize: 4, size: 93 ,    "imports":   ["D:\\gitwork\\auto-generate-md\\unuse\\components\\user-rulerts.vue",
    //  ]})
  })
  } catch (error) {
  done(error)
  }
})
