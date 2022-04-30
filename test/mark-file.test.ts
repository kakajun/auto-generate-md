import {
  findNodes,
  deletMark,
  setNodeMark,
  witeFile
  // setmark,
  // deletMarkAll
} from '../src/commands/mark-file'
import { nodeOne, nodesMark, routersMarg } from './nodes'
import fs from 'fs-extra'
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
        const receive = deletMark(file, 'base')
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
      creatFile(file)
      try {
        deletMark(file, 'base')
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

  test('witeFile--标记文件主程序', (done) => {
    async function get() {
      const file = rootPath + '/test/temp/wite-file-test.vue'
      creatFile(file)
      const fold = rootPath + '/test/temp/my'
      fs.ensureDirSync(fold)
      const file2 = rootPath + '/test/temp/my/wite-file2.vue'
      creatFile(file2)


      try {
        witeFile(nodesMark, routersMarg)
        // const str = fs.readFileSync(file, 'utf-8')
        // const index = str.indexOf('//base')
        // expect(index).toEqual(0)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })
})
