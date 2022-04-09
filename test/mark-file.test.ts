
import {
  findNodes, deletMark,
  setNodeMark
} from '../src/commands/mark-file';
import { ItemType } from '../src/commands/get-file'

import fs from 'fs'
test('findNodes--查node', () => {
  const nodes = [
    {
      name: 'deep',
      isDir: true,
      level: 3,
      note: '',
      imports: [''],
      belongTo: [''],
      children: [
        {
          name: 'user.vue',
          isDir: false,
          level: 4,
          note: '//2工程\r',
          imports: [process.cwd() + '\\unuse\\api\\user.js'],
          belongTo: [''],
          size: 1784,
          rowSize: 108,
          suffix: '.vue',
          fullPath: process.cwd() + '\\unuse\\components\\test\\deep\\user.vue'
        },
        {
          name: 'user2.vue',
          isDir: false,
          level: 4,
          note: '//2工程\r',
          imports: [process.cwd() + '\\unuse\\api\\user2.js'],
          belongTo: [''],
          size: 1784,
          rowSize: 108,
          suffix: '.vue',
          fullPath: process.cwd() + '\\unuse\\components\\test\\deep\\user2.vue'
        }
      ]
    }
  ]

  const node = findNodes(
    nodes as Array<ItemType>,
    process.cwd() + '\\unuse\\components\\test\\deep\\user2.vue'
  )
  const finalObj = {
    name: 'user2.vue',
    isDir: false,
    level: 4,
    note: '//2工程\r',
    imports: [process.cwd() + '\\unuse\\api\\user2.js'],
    belongTo: [''],
    size: 1784,
    rowSize: 108,
    suffix: '.vue',
    fullPath: process.cwd() + '\\unuse\\components\\test\\deep\\user2.vue'
  }
   expect(node).toMatchObject(finalObj)
})

test('deletMark--测试删除标记', (done) => {
  const str = `//base
  //base
<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    const file = process.cwd() + '\\test\\temp\\bb.vue'
    const finalStr = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    try {
      fs.writeFile(file, str, { encoding: 'utf8' },async () => {
        const receive =await deletMark(file, 'base')
        done()
        expect(receive).toEqual(finalStr)
      })
    } catch (error) {
      done(error)
    }

})

test('setNodeMark--给节点标记',  (done) => {
  const nodes = [
    {
      name: 'app-file-test.vue',
      isDir: false,
      level: 2,
      note: ' // 我就是个注释\r',
      imports: [process.cwd() + '\\test\\temp\\aa.vue'],
      belongTo: [],
      size: 96,
      rowSize: 4,
      suffix: '.vue',
      fullPath: process.cwd() + '\\test\\temp\\app-file-test.vue'
    },
    {
      name: 'aa.vue',
      isDir: false,
      level: 2,
      note: ' // 我就是个注释\r',
      imports: [],
      belongTo: [],
      size: 96,
      rowSize: 4,
      suffix: '.vue',
      fullPath: process.cwd() + '\\test\\temp\\aa.vue'
    }
  ]
  async function get() {
   const file = process.cwd() + '\\test\\temp\\app-file-test.vue'
   try {
    await deletMark(file, 'base')
     await setNodeMark(nodes, 'base', file)
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
