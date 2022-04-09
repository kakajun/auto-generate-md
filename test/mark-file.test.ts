
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
          imports: ['D:\\gitwork\\auto-generate-md\\unuse\\api\\user.js'],
          belongTo: [''],
          size: 1784,
          rowSize: 108,
          suffix: '.vue',
          fullPath: 'D:\\gitwork\\auto-generate-md\\unuse\\components\\test\\deep\\user.vue'
        },
        {
          name: 'user2.vue',
          isDir: false,
          level: 4,
          note: '//2工程\r',
          imports: ['D:\\gitwork\\auto-generate-md\\unuse\\api\\user2.js'],
          belongTo: [''],
          size: 1784,
          rowSize: 108,
          suffix: '.vue',
          fullPath: 'D:\\gitwork\\auto-generate-md\\unuse\\components\\test\\deep\\user2.vue'
        }
      ]
    }
  ]

  const node = findNodes(
    nodes as Array<ItemType>,
    "D:\\gitwork\\auto-generate-md\\unuse\\components\\test\\deep\\user2.vue"
  )
  const finalObj = {
    name: 'user2.vue',
    isDir: false,
    level: 4,
    note: '//2工程\r',
    imports: ['D:\\gitwork\\auto-generate-md\\unuse\\api\\user2.js'],
    belongTo: [''],
    size: 1784,
    rowSize: 108,
    suffix: '.vue',
    fullPath: 'D:\\gitwork\\auto-generate-md\\unuse\\components\\test\\deep\\user2.vue'
  }
   expect(node).toMatchObject(finalObj)
})

test('deletMark--测试删除标记', (done) => {
  const str = `//base
  //base
<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    const file = __dirname + '\\unuse\\AppDeletMarTest.vue'
    const finalStr = `<script setup>
import UserRuler from '@/unuse/components/user-rulerts'
</script>`
    try {
      fs.writeFile(file, str, { encoding: 'utf8' },async () => {
        const receive =await deletMark(file, 'base')
        done()
        // fs.unlinkSync(file)
        expect(receive).toEqual(finalStr)
      })
    } catch (error) {
      done(error)
    }

})

test('setNodeMark--给节点标记', async (done) => {
  const nodes = [
    {
      name: 'app-file-test.vue',
      isDir: false,
      level: 2,
      note: ' // 我就是个注释\r',
      imports: [],
      belongTo: [],
      size: 96,
      rowSize: 4,
      suffix: '.vue',
      fullPath: 'D:\\worker\\auto-generate-md\\test\\temp\\app-file-test.vue'
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
      fullPath: 'D:\\worker\\auto-generate-md\\test\\temp\\aa.vue'
    }
  ]
  const str = `//base
  //base
<script setup>
import UserRuler from './unuse/components/user-rulerts'
</script>`
  const file = __dirname + '\\unuse\\AppDeletMarTest.vue'
  const finalStr = `<script setup>
import UserRuler from './unuse/components/user-rulerts'
</script>`
  await setNodeMark(nodes, ele.name, absolutePath)
  try {

  } catch (error) {
    done(error)
  }
})
