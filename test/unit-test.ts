/* 专门做函数单元测试 */
import createDebugger from 'debug'
import path from 'path';
const debug = createDebugger('unit-test')
debug.enabled = true

import {
  changeImport,
  makeSuffix
} from '../src/commands/change-path';

const obj=  makeSuffix('src/commands/change-path', 'src/commands/change-path'
  )
debug('obj:', obj)

 const obj2 = changeImport(
   "import { getRelatPath, makeSuffix, changeImport } from '@/src/commands/change-path'",
   path.resolve('src/commands/change-path'))

debug('tobe:  src/commands/change-path.ts')
debug('obj2:', obj2)
