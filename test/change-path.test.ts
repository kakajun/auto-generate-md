import path from 'path'
import fs from 'fs-extra'
import { getRelatPath, makeSuffix, changeImport, witeFile, getImportName } from '../src/commands/change-path'
import { nodeOne } from './nodes'
import createDebugger from 'debug'
const debug = createDebugger('change-path.test')
debug.enabled = false
const rootPath = process.cwd().replace(/\\/g, '/')
describe('change-path的测试', () => {
  test('getRelatPath--获取相对地址', () => {
    let foldPath = rootPath + '/test/temp'
    fs.removeSync(foldPath) // 先清空目录
    debug('删除文件成功%%%%%%%%%%%%%%%%%%%')
    fs.ensureDirSync(foldPath)
    expect(getRelatPath('/unuse/components/user-rulerts.vue', '/unuse/App.vue')).toEqual(
      './components/user-rulerts.vue'
    )
  })

  test('makeSuffix--补全后缀和@替换', () => {
    expect(makeSuffix('@/src/commands/change-path', '@/src/commands/change-path')).toEqual(
      path.resolve('src/commands/change-path.ts').replace(/\\/g, '/')
    )
  })
  test('makeSuffix--得到import', () => {
    let arrs = getImportName(`import
      { getRelatPath,
         makeSuffix,
         changeImport
      } from '@/unuse/components/user-rulerts'`)
    debug('arrs: ', arrs)
    expect(arrs).toEqual('@/unuse/components/user-rulerts')
  })

  test('changeImport--更改不规范path', () => {
    expect(
      changeImport(
        "import { getRelatPath, makeSuffix, changeImport } from '@/unuse/components/user-rulerts'",
        path.resolve('unuse/App.vue').replace(/\\/g, '/')
      )
    ).toEqual({
      filePath: '@/unuse/components/user-rulerts',
      impName: './components/user-rulerts.vue',
      absoluteImport: rootPath + '/unuse/components/user-rulerts.vue'
    })
  })

  test('witeFile--更改不规范path', (done) => {
    try {
      const node = nodeOne[0]
      // 1. 随机创建一个文件
      const str = `<script setup>
import {
  UserRuler,
  aa
} from '@/unuse/components/user-rulerts'
</script>`
      //2. 预期得到内容
      const finalStr = `<script setup>
import {
  UserRuler,
  aa
} from '../../unuse/components/user-rulerts.vue'
</script>`
      const file = path.resolve(rootPath, node.fullPath)
      // 异步写入数据到文件
      fs.writeFileSync(file, str, { encoding: 'utf8' })
      debug('Write successful')
      witeFile(node, true)
      done()
      const getStr = fs.readFileSync(file, 'utf-8')
      expect(getStr).toEqual(finalStr)
    } catch (error) {
      done(error)
    }
  })
})
