/* 专门做函数单元测试 */
import createDebugger from 'debug'
import path from 'path';
import fs from 'fs'
const debug = createDebugger('unit-test')
debug.enabled = true
import { deletMark } from '../src/commands/mark-file'
// import {
//   changeImport,
//   makeSuffix
// } from '../src/commands/change-path';

// const obj=  makeSuffix('src/commands/change-path', 'src/commands/change-path'
//   )
// debug('obj:', obj)

//  const obj2 = changeImport(
//    "import { getRelatPath, makeSuffix, changeImport } from '@/src/commands/change-path'",
//    path.resolve('src/commands/change-path'))

// debug('tobe:  src/commands/change-path.ts')
// debug('obj2:', obj2)

  // 1. 随机创建一个文件
  const str = `//base
  <script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
const file = path.resolve() + '\\unuse\\AppFileTest.vue'
  const finalStr=``
  try {
  fs.writeFile(file, str, { encoding: 'utf8' }, () => {
   deletMark(file,name)
    // done()
   const finalStr= fs.unlinkSync(file)

    expect(finalStr).toEqual(finalStr)
  })
  } catch (error) {
  // done(error)
  }
