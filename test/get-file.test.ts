import { getFile, getImport, getFileNodes, getNote } from '../src/commands/get-file'
import { creatFile } from './utils'
import createDebugger from 'debug'
const rootPath = process.cwd().replace(/\\/g, '/')
const debug = createDebugger('get-file.test')
debug.enabled = false
describe('get-file的测试', () => {
  const nodes = [
    {
      name: 'constant.ts',
      isDir: false,
      level: 0,
      note: '/* 解析package */\r',
      imports: [rootPath + '/package.json'],
      belongTo: [],
      size: 175,
      rowSize: 9,
      suffix: '.ts',
      fullPath: rootPath + '/src/shared/constant.ts'
    },
    {
      name: 'logger.ts',
      isDir: false,
      level: 0,
      note: '/* 打个漂亮日志 */\r',
      imports: [''],
      belongTo: [],
      size: 531,
      rowSize: 21,
      suffix: '.ts',
      fullPath: rootPath + '/src/shared/logger.ts'
    }
  ]
  test('getFile--获取注释', (done) => {
    async function get() {
      const file = rootPath + '/test/temp/app-file-test.vue'
      const file2 = rootPath + '/test/temp/aa.vue'
      try {
        await creatFile(file)
        await creatFile(file2)
        const obj = getFile(file)
        done()
        expect(obj).toEqual({
          note: '// 我就是个注释',
          rowSize: 4,
          size: 63,
          imports: [rootPath + '/test/temp/aa.vue']
        })
      } catch (error) {
        done(error)
      }
    }
    get()
  })

  test('getImport--获取每个文件依赖的方法', () => {
    const str = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    const sarr = str.split(/[\n]/g)
    const arrs = getImport(sarr, rootPath + '/test/temp/bb.vue')
    expect(arrs).toMatchObject([rootPath + '/unuse/components/user-rulerts.vue'])
  })

  test('getFileNodes--生成所有文件的node信息', () => {
    const arrs = getFileNodes(rootPath + '/src/shared')
    //  console.log(arrs)
    expect(arrs).toMatchObject(nodes)
  })

  test('getImport--获取每个文件依赖的方法', () => {
    const notes = [
      '├── constant.ts            /* 解析package */\r\n',
      '└── logger.ts            /* 打个漂亮日志 */\r\n'
    ]
    const arrs = getNote(nodes)
    console.log(arrs, 'arrs')
    expect(arrs).toMatchObject(notes)
  })
})
