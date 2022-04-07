import path from 'path'
import fs from 'fs'
import { getRelatPath, makeSuffix, changeImport, witeFile } from '../src/commands/change-path'
test('getRelatPath--获取相对地址', () => {
  expect(
    getRelatPath(
      'D:\\worker\\auto-generate-md\\unuse\\components\\user-rulerts.vue',
      'D:\\worker\\auto-generate-md\\unuse\\App.vue'
    )
  ).toEqual('./components/user-rulerts.vue')
})

test('makeSuffix--补全后缀和@替换', () => {
  expect(makeSuffix('@/src/commands/change-path', '@/src/commands/change-path')).toEqual(
    path.resolve('src/commands/change-path.ts')
  )
})

test('changeImport--更改不规范path', () => {
  expect(
    changeImport(
      "import { getRelatPath, makeSuffix, changeImport } from '@/unuse/components/user-rulerts.vue'",
      path.resolve('unuse/App.vue')
    )
  ).toEqual({
    filePath: '@/unuse/components/user-rulerts.vue',
    impName: './components/user-rulerts.vue',
    absoluteImport: path.resolve() + '\\unuse\\components\\user-rulerts.vue'
  })
})

test('witeFile--更改不规范path', (done) => {

  try {
    const node = {
      name: 'AppTest.vue',
      isDir: false,
      level: 0,
      note: '',
      imports: new Array(),
      belongTo: new Array(),
      size: 367,
      rowSize: 12,
      suffix: '.js',
      fullPath: path.resolve() + '\\unuse\\AppTest.vue'
    }
    // 1. 随机创建一个文件
    const str = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    //2. 预期得到内容
    const finalStr = `<script setup>
import UserRuler from './components/user-rulerts.vue'
</script>`
    const file = path.resolve(__dirname, node.fullPath)
    // 异步写入数据到文件
    fs.writeFile(file, str, { encoding: 'utf8' }, async () => {
      console.log('Write successful')
      await witeFile(node, true)
      done()
      const getStr = fs.readFileSync(file, 'utf-8')
       fs.unlinkSync(path.resolve() + '\\unuse\\AppTest.vue')
      expect(getStr).toEqual(finalStr)
    })
  } catch (error) {
    done(error)
  }
})
