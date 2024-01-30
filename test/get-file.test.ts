import { getFile, getImport, getFileNodes, getNote, setMd } from '../src/commands/get-file'
import { creatFile } from './utils/utils'
import type { ItemType } from '../src/types'
import deepNodes from './utils/deep-nodes'
import { createConsola } from 'consola'
const rootPath = process.cwd().replace(/\\/g, '/')
const logger = createConsola({
  level: 4
})

// 由于linux的空格数和window的空格数不一样, 所以size始终不一样, 无法测试, 所以这里干掉size
// 递归树结构设置size为0
function setSize(temparrs: any[]) {
  temparrs.forEach((item) => {
    item.size = 0
    if (item.children) {
      setSize(item.children)
    }
  })
}

describe('setMd', () => {
  it('should correctly format the string for a directory', () => {
    const obj: ItemType = {
      name: 'dir',
      isDir: true,
      level: 1,
      note: '',
      fullPath: '',
      belongTo: [],
      imports: []
    }

    const result = setMd(obj, false)

    expect(result).toEqual('│ ├── dir\n')
  })

  it('should correctly format the string for a file', () => {
    const obj: ItemType = {
      name: 'file.js',
      isDir: false,
      level: 1,
      note: 'note',
      fullPath: '',
      belongTo: [],
      imports: []
    }
    const result = setMd(obj, true)
    expect(result).toEqual('│ └── file.js            note\n')
  })
})

describe('get-file的测试', () => {
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
        const arrs = await getFileNodes(rootPath + '/unuse/components')
        setSize(arrs)
        setSize(deepNodes)
        // console.log(JSON.stringify(deepNodes), 'arrs')
        expect(arrs).toMatchObject(deepNodes)

        done()
      }
      get()
    } catch (error) {
      logger.error(error)
      done(error)
    }
  })

  test('getImport--获取每个文件依赖的方法', (done) => {
    try {
      async function get() {
        const notes = await getFileNodes(rootPath + '/unuse/components')
        setSize(notes)
        const arrs = getNote(notes)
        console.log(JSON.stringify(arrs), 'arrs')
        expect(arrs).toMatchObject(notes)
        done()
      }
      get()
    } catch (error) {
      logger.error(error)
      done(error)
    }
  })
})
