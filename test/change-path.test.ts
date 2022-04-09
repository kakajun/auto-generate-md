import path from 'path'
// import fs from 'fs'
import {
  getRelatPath, makeSuffix,
  // changeImport, witeFile
} from '../src/commands/change-path'
// import nodes from './nodes'
import createDebugger from 'debug'
const debug = createDebugger('change-path.test')
debug.enabled = true

test('getRelatPath--获取相对地址', () => {
  debug('process.cwd()', process.cwd())
  expect(
    getRelatPath(
      process.cwd() + '\\unuse\\components\\user-rulerts.vue',
      process.cwd() + '\\unuse\\App.vue'
    )
  ).toEqual('./components/user-rulerts.vue')
})

test('makeSuffix--补全后缀和@替换', () => {
  expect(makeSuffix('@/src/commands/change-path', '@/src/commands/change-path')).toEqual(
    path.resolve('src/commands/change-path.ts')
  )
})

// test('changeImport--更改不规范path', () => {
//   expect(
//     changeImport(
//       "import { getRelatPath, makeSuffix, changeImport } from '@/unuse/components/user-rulerts.vue'",
//       path.resolve('unuse/App.vue')
//     )
//   ).toEqual({
//     filePath: '@/unuse/components/user-rulerts.vue',
//     impName: './components/user-rulerts.vue',
//     absoluteImport: process.cwd() + '\\unuse\\components\\user-rulerts.vue'
//   })
// })

// test('witeFile--更改不规范path', (done) => {
//   try {
//     const node = nodes[0]
//     // 1. 随机创建一个文件
//     const str = `<script setup>
// import UserRuler from '@/unuse/components/user-rulerts'
// </script>`
//     //2. 预期得到内容
//     const finalStr = `<script setup>
// import UserRuler from '../../unuse/components/user-rulerts.vue'
// </script>`
//     const file = path.resolve(process.cwd(), node.fullPath)
//     // 异步写入数据到文件
//     fs.writeFile(file, str, { encoding: 'utf8' }, async () => {
//       console.log('Write successful')
//       await witeFile(node, true)
//       done()
//       const getStr = fs.readFileSync(file, 'utf-8')
//       expect(getStr).toEqual(finalStr)
//     })
//   } catch (error) {
//     done(error)
//   }
// })
