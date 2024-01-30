import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { getRelatPath, makeSuffix, changeImport, writeToFile, getImportName } from '../src/commands/change-path'
import { nodeOne } from './utils/nodes-test'
import { createConsola } from 'consola'
const logger = createConsola({
  level: 4
})
const rootPath = process.cwd().replace(/\\/g, '/')
describe('change-path的测试', () => {
  test('getRelatPath--获取相对地址', () => {
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
    const arrs = getImportName(
      `import
      { getRelatPath,
         makeSuffix,
         changeImport
      } from '@/unuse/components/user-rulerts'`,
      ['@types/node']
    )
    logger.info('arrs: ', arrs)
    expect(arrs).toEqual('@/unuse/components/user-rulerts')
  })

  test('changeImport--更改不规范path', () => {
    expect(
      changeImport(
        "import { getRelatPath, makeSuffix, changeImport } from '@/unuse/components/user-rulerts'",
        path.resolve('unuse/App.vue').replace(/\\/g, '/'),
        ['@types/node']
      )
    ).toEqual({
      filePath: '@/unuse/components/user-rulerts',
      impName: './components/user-rulerts.vue',
      absoluteImport: rootPath + '/unuse/components/user-rulerts.vue'
    })
  })

  test('writeToFile--更改不规范path', (done) => {
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
} from '../unuse/components/user-rulerts.vue'
</script>`

      const file = path.resolve(rootPath, node.fullPath)
      logger.info('file: ', file)

      async function get() {
        // 异步写入数据到文件
        await writeFile(file, str, { encoding: 'utf8' })
        logger.success('Write successful')
        await writeToFile(node, true)
        const getStr = await readFile(file, 'utf-8')
        expect(getStr).toEqual(finalStr)
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })
})
