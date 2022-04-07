import path from 'path';
import {
  getRelatPath,
  // makeSuffix, changeImport
} from '../src/commands/change-path';
test('getRelatPath--获取相对地址', () => {
  expect(
    getRelatPath(
      'D:\\worker\\auto-generate-md\\unuse\\components\\user-rulerts.vue',
      'D:\\worker\\auto-generate-md\\unuse\\App.vue'
    )
  ).toEqual('./components/user-rulerts.vue')
})

// test('makeSuffix--补全后缀和@替换', () => {
//   expect(
//     makeSuffix(path.resolve('@/src/commands/change-path'), '@/src/commands/change-path',
//   )).toEqual(path.resolve('src/commands/change-path.ts'))
// })

// test('changeImport--更改不规范path', () => {

//   expect(
//     changeImport(
//       "import { getRelatPath, makeSuffix, changeImport } from '@/src/commands/change-path'",
//       path.resolve('src/commands/change-path')
//     )
//   ).toEqual('src/commands/change-path.ts')
// })
