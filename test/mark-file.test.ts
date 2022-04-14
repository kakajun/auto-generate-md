import { findNodes, deletMark, setNodeMark } from '../src/commands/mark-file'
import { nodeOne } from './nodes'
import fs from 'fs'
import { creatFile } from './utils'
const rootPath = process.cwd().replace(/\\/g, '/')
import createDebugger from 'debug'
const debug = createDebugger('mark-file.test')
debug.enabled = false

describe('mark-file.test的测试', () => {
  test('findNodes--查node', () => {
    const node = findNodes(nodeOne, rootPath + '/test/temp/app-file-test.vue')
    expect(node).toMatchObject(nodeOne[0])
  })

  test('deletMark--测试删除标记', (done) => {
    const str = `//base
  //base
<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    const file = rootPath + '/test/temp/bb.vue'
    const finalStr = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    try {
      fs.writeFile(file, str, { encoding: 'utf8' }, async () => {
        const receive = await deletMark(file, 'base')
        done()
        expect(receive).toEqual(finalStr)
      })
    } catch (error) {
      done(error)
    }
  })

  test('setNodeMark--给节点标记', (done) => {
    async function get() {
      const file = rootPath + '/test/temp/app2-file-test.vue'
      await creatFile(file)
      try {
        await deletMark(file, 'base')
        await setNodeMark(nodeOne, 'base', file)
        const str = fs.readFileSync(file, 'utf-8')
        const index = str.indexOf('//base')
        expect(index).toEqual(0)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })
})
