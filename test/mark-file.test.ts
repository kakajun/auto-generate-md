import { findNodes, deletMark, setNodeMark, witeMarkFile, setmark, deletMarkAll } from '../src/commands/mark-file'
import { nodeOne, nodesMark, routersMarg } from './nodes'
import fs from 'fs-extra'
import { creatFile, creatFileNoimport } from './utils'
const rootPath = process.cwd().replace(/\\/g, '/')
import createDebugger from 'debug'
const debug = createDebugger('mark-file.test')
debug.enabled = false

describe('mark-file.test的测试', () => {
  test('findNodes--查node', () => {
    const node = findNodes(nodeOne, rootPath + '/temp/app-file-test.vue')
    expect(node).toMatchObject(nodeOne[0])
  })

  test('setmark--给节点标记', () => {
    const file = rootPath + '/temp/mark-setmark.vue'
    try {
      creatFile(file)
      setmark(file, 'setmark')
      const str = fs.readFileSync(file, 'utf-8')
      debug(str, '444')
      const flag = str.indexOf('setmark') > -1
      expect(flag).toEqual(true)
    } catch (error) {
      console.error(error)
    }
  })

  test('deletMarkAll--递归所有文件,删除所有标记', () => {
    const file = rootPath + '/temp/delet-mark-all.vue'
    creatFile(file)
    setmark(file, 'setmark')
    const nodes = [
      {
        name: 'mark-setmark',
        isDir: false,
        level: 2,
        note: ' // 我就是个注释',
        imports: [],
        belongTo: ['setmark'],
        size: 96,
        copyed: false,
        rowSize: 4,
        suffix: '.vue',
        fullPath: rootPath + '/temp/delet-mark-all.vue'
      }
    ]
    deletMarkAll(nodes, 'setmark')
    const str = fs.readFileSync(file, 'utf-8')
    debug(str, '444')
    const flag = str.indexOf('setmark') > -1
    expect(flag).toEqual(false)
  })

  test('deletMark--测试删除标记', (done) => {
    const str = `//mark
  //mark
<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    const file = rootPath + '/temp/bb.vue'
    const finalStr = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    try {
      fs.writeFile(file, str, { encoding: 'utf8' }, async () => {
        const receive = deletMark(file, 'mark')
        done()
        expect(receive).toEqual(finalStr)
      })
    } catch (error) {
      done(error)
    }
  })

  test('setNodeMark--给节点标记', (done) => {
    async function get() {
      const file = rootPath + '/temp/app2-file-test.vue'
      creatFile(file)
      try {
        deletMark(file, 'mark')
        await setNodeMark(nodeOne, 'mark', file)
        const str = fs.readFileSync(file, 'utf-8')
        const index = str.indexOf('//mark')
        expect(index).toEqual(0)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })

  test('witeMarkFile--标记文件主程序写入分类', (done) => {
    async function get() {
      const foldPath = rootPath + '/test2'
      fs.removeSync(foldPath) // 先清空目录
      const file = rootPath + '/temp/wite-file-test.vue'
      creatFileNoimport(file)
      const fold = rootPath + '/temp/my'
      fs.ensureDirSync(fold)
      const file2 = rootPath + '/temp/my/wite-file2.vue'
      creatFile(file2)
      const file3 = rootPath + '/temp/my/aa.vue'
      creatFileNoimport(file3)
      try {
        await witeMarkFile(nodesMark, routersMarg)
        const finalPath = rootPath + '/test2/temp/wite-file-test.vue'
        const flag = fs.existsSync(finalPath)
        expect(flag).toEqual(true)
        done()
      } catch (error) {
        done(error)
      }
    }
    get()
  })
})
