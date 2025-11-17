import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { changeImport, writeToFile } from '../src/commands/change-path'
import { nodeOne } from './utils/nodes-test'
import { createConsola } from 'consola'

const logger = createConsola({ level: 4 })
const rootPath = process.cwd().replace(/\\/g, '/')

describe('change-path 绝对路径（@别名）测试', () => {
  test('changeImport--转换为 @ 别名的绝对路径', () => {
    const result = changeImport(
      "import { getRelatPath, makeSuffix, changeImport } from '../unuse/components/user-rulerts'",
      path.resolve('unuse/App.vue').replace(/\\/g, '/'),
      ['@types/node'],
      false,
      true
    )
    expect(result).toEqual({
      filePath: '../unuse/components/user-rulerts',
      impName: '@/unuse/components/user-rulerts.vue',
      absoluteImport: rootPath + '/unuse/components/user-rulerts.vue'
    })
  })

  test('writeToFile--将相对路径改为 @ 别名绝对路径', async () => {
    const node = nodeOne[0]
    const str = `<script setup>\nimport { UserRuler, aa } from '../unuse/components/user-rulerts'\n</script>`

    const file = path.resolve(rootPath, node.fullPath)
    await writeFile(file, str, { encoding: 'utf8' })
    logger.success('Write successful')
    await writeToFile(node, true, false, true)
    const getStr = await readFile(file, 'utf-8')
    expect(getStr.includes("from '@/unuse/components/user-rulerts.vue'")).toBe(true)
  })
})
