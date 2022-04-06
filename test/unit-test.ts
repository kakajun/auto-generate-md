/* 专门做函数单元测试 */
import createDebugger from 'debug'
const debug = createDebugger('unit-test')
debug.enabled = true
import path from 'path';
// import {
//   // changeImport,
//   makeSuffix
// } from '../src/commands/change-path';

// const obj=  makeSuffix('@/src/commands/change-path', '@/src/commands/change-path',
//     path.resolve('./')
//   )

//  const obj2 = changeImport(
//    "import { getRelatPath, makeSuffix, changeImport } from '@/src/commands/change-path'",
//    path.resolve('src/commands/change-path'),
//    path.resolve('./'))

    debug('tobe:  src/commands/change-path.ts')
debug('obj:', path.resolve())
