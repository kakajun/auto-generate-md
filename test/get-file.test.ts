import { getFile, getImport, getFileNodes, getNote } from '../src/commands/get-file'
import { creatFile } from './utils/utils'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})
describe('get-file的测试', () => {
  const nodes = [
    {
      name: 'index.js',
      isDir: false,
      level: 0,
      note: '/* 我就是个测试 */',
      imports: ['D:/gitwork/auto-generate-md/unuse/app.vue'],
      belongTo: [],
      size: 0,
      rowSize: 4,
      suffix: '.js',
      fullPath: 'D:/gitwork/auto-generate-md/unuse/test/index.js'
    }
  ]
  test('getFile--获取注释', (done) => {
    const file = rootPath + '/temp/app-file-test.vue'
    const file2 = rootPath + '/temp/aa.vue'
    try {
      creatFile(file)
      creatFile(file2)
      async function get() {
        const obj = await getFile(file)
        expect(obj).toEqual({
          note: '// 我就是个注释',
          rowSize: 4,
          size: 63,
          imports: [rootPath + '/temp/aa.vue']
        })
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })

  test('getImport--获取每个文件依赖的方法', (done) => {
    const str = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    try {
      async function get() {
        const sarr = str.split(/[\n]/g)
        const arrs = await getImport(sarr, rootPath + '/temp/bb.vue')
        expect(arrs).toMatchObject([rootPath + '/unuse/components/user-rulerts.vue'])
        done()
      }
      get()
    } catch (error) {
      done(error)
    }
  })

  test('getFileNodes--生成所有文件的node信息', (done) => {
    try {
      async function get() {
        const arrs = await getFileNodes(rootPath + '/unuse/test')
        // 由于linux的空格数和window的空格数不一样, 所以size始终不一样, 无法测试, 所以这里干掉size
        arrs.forEach((item) => {
          item.size = 0
        })
        nodes.forEach((item) => {
          item.size = 0
        })
        console.log(JSON.stringify(nodes), 'arrs')
        expect(arrs).toMatchObject(nodes)
        done()
      }
      get()
    } catch (error) {
      logger.error(error)
      done(error)
    }
  })

  test('getImport--获取每个文件依赖的方法', () => {
    const notes = ['└── index.js            /* 我就是个测试 */\n']
    const arrs = getNote(nodes)
    console.log(JSON.stringify(arrs), 'arrs')
    expect(arrs).toMatchObject(notes)
  })
})
